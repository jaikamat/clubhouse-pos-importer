import { ClubhouseLocation } from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';

interface Args {
    location: ClubhouseLocation;
    startDate: Date;
    endDate: Date;
}

const createGroupStage = (groupId: string) => {
    return {
        _id: groupId,
        count: { $sum: 1 },
        card_title: { $first: '$card_title' },
    };
};

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
            card_id: '$card_list.id',
            card_title: '$card_list.name',
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
                { $group: createGroupStage('$card_id') },
                { $sort: sort },
                { $limit: limit },
                // Here we convert the `_id` we used in $group to a more reasonable name
                {
                    $addFields: {
                        scryfall_id: '$_id',
                    },
                },
                { $project: { _id: 0 } }, // Suppress _id we used in $group
            ],
            countByCardName: [
                { $group: createGroupStage('$card_title') },
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
