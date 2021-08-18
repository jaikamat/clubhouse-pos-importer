import {
    ClubhouseLocation,
    Collection,
    FinishCondition,
    QOH,
} from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';
import isNonfoil from '../lib/isNonfoil';
import parseQoh from '../lib/parseQoh';
import ScryfallCard from './ScryfallCard';

interface CountByPrinting {
    _id: {
        scryfall_id: string;
        finish_condition: FinishCondition;
    };
    count: number;
    card_title: string;
    card_metadata: ScryfallCard;
    quantity_on_hand: Partial<QOH>;
}

interface CountByCardName {
    count: number;
    card_title: string;
}

interface QueryResult {
    countByPrinting: Array<CountByPrinting>;
    countByCardName: Array<CountByCardName>;
}

interface Args {
    location: ClubhouseLocation;
    startDate: Date;
    endDate: Date;
}

async function getSalesReport({ location, startDate, endDate }: Args) {
    try {
        const db = await getDatabaseConnection();
        const collection = collectionFromLocation(location).salesData;

        const aggregation = [];

        const unwind = {
            path: '$card_list',
            preserveNullAndEmptyArrays: true,
        };

        const project = {
            created_at: { $toDate: '$_id' },
            scryfall_id: '$card_list.id',
            card_title: '$card_list.name',
            quantity_sold: '$card_list.qtyToSell',
            finish_condition: '$card_list.finishCondition',
        };

        const match = {
            created_at: {
                $gte: startDate,
                $lte: endDate,
            },
        };

        const sort = { count: -1 };
        const limit = 100;

        const facet = {
            countByPrinting: [
                {
                    $group: {
                        _id: {
                            scryfall_id: '$scryfall_id',
                            finish_condition: '$finish_condition',
                        },
                        count: { $sum: '$quantity_sold' },
                        card_title: { $first: '$card_title' },
                    },
                },
                { $sort: sort },
                { $limit: limit },
                // Join on bulk cards for metadata
                {
                    $lookup: {
                        from: Collection.scryfallBulkCards,
                        localField: '_id.scryfall_id',
                        foreignField: 'id',
                        as: 'card_metadata',
                    },
                },
                // Join on current inventory for current QOH
                {
                    $lookup: {
                        from: Collection.cardInventory,
                        localField: '_id.scryfall_id',
                        foreignField: '_id',
                        as: 'inventory',
                    },
                },
                {
                    $addFields: {
                        card_metadata: { $first: '$card_metadata' },
                        inventory: { $first: '$inventory' },
                    },
                },
                {
                    $addFields: {
                        quantity_on_hand: '$inventory.qoh',
                    },
                },
            ],
            countByCardName: [
                {
                    $group: {
                        _id: '$card_title',
                        count: { $sum: '$quantity_sold' },
                        card_title: { $first: '$card_title' },
                    },
                },
                { $sort: sort },
                { $limit: limit },
                { $project: { _id: 0 } }, // Suppress _id we used in $group
            ],
        };

        aggregation.push({ $unwind: unwind });
        aggregation.push({ $project: project });
        aggregation.push({ $match: match });
        aggregation.push({ $facet: facet });

        const doc = await db
            .collection(collection)
            .aggregate(aggregation)
            .toArray();

        const result: QueryResult = doc[0];

        /**
         * Transform the data with a custom _id for client use and
         * and infer quantity on hand for the indicated finish_condition
         */
        return {
            countByPrinting: result.countByPrinting.map((c) => {
                const id = `${c._id.scryfall_id}-${c._id.finish_condition}`;

                // Infer finish from the finish_condition
                const nonfoil = isNonfoil(c._id.finish_condition);

                // Parse the entire QOH to use with inferred finish
                const { foilQty, nonfoilQty } = parseQoh(c.quantity_on_hand);

                return {
                    ...c,
                    _id: id,
                    scryfall_id: c._id.scryfall_id,
                    finish_condition: c._id.finish_condition,
                    finish: nonfoil ? 'NONFOIL' : 'FOIL',
                    quantity_on_hand: nonfoil ? nonfoilQty : foilQty,
                };
            }),
            countByCardName: result.countByCardName,
        };
    } catch (e) {
        throw e;
    }
}

export default getSalesReport;
