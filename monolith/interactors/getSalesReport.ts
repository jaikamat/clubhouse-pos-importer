import { ClubhouseLocation, Collection } from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';

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
                {
                    $lookup: {
                        from: Collection.scryfallBulkCards,
                        localField: '_id.scryfall_id',
                        foreignField: 'id',
                        as: 'card_metadata',
                    },
                },
                {
                    $addFields: {
                        card_metadata: { $first: '$card_metadata' },
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

        return doc[0];
    } catch (e) {
        throw e;
    }
}

export default getSalesReport;
