import mongoose from 'mongoose';
import RawScryfallCard from '../common/RawScryfallCard';
import { ScryfallApiCard } from '../common/ScryfallApiCard';
import {
    ClubhouseLocation,
    Collection,
    FinishCondition,
    QOH,
} from '../common/types';
import collectionFromLocation from '../lib/collectionFromLocation';
import isNonfoil from '../lib/isNonfoil';
import parseQoh from '../lib/parseQoh';

interface CountByPrinting {
    _id: {
        scryfall_id: string;
        finish_condition: FinishCondition;
    };
    quantity_sold: number;
    card_title: string;
    card_metadata: RawScryfallCard;
    quantity_on_hand: QOH;
}

interface CountByCardName {
    quantity_sold: number;
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
        const db = await mongoose.connection.db;
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

        const sort = { quantity_sold: -1 };
        const limit = 100;

        const facet = {
            countByPrinting: [
                {
                    $group: {
                        _id: {
                            scryfall_id: '$scryfall_id',
                            finish_condition: '$finish_condition',
                        },
                        quantity_sold: { $sum: '$quantity_sold' },
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
                        from: collectionFromLocation(location).cardInventory,
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
                        quantity_sold: { $sum: '$quantity_sold' },
                        card_title: { $first: '$card_title' },
                    },
                },
                { $sort: sort },
                { $limit: limit },
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

        // TODO: remove any and replace with mongoose schema queries
        const result: any = doc[0];

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
                    // TODO: support etched
                    finish: nonfoil ? 'NONFOIL' : 'FOIL',
                    quantity_on_hand: nonfoil ? nonfoilQty : foilQty,
                    estimated_price: nonfoil
                        ? c.card_metadata.prices.usd
                        : c.card_metadata.prices.usd_foil,
                    card_metadata: new ScryfallApiCard(c.card_metadata),
                };
            }),
            countByCardName: result.countByCardName,
        };
    } catch (e) {
        throw e;
    }
}

export default getSalesReport;
