import { ClubhouseLocation } from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';

interface Args {
    location: ClubhouseLocation;
    startDate: Date | null;
    endDate: Date | null;
    cardName: string | null;
}

async function getCardsFromReceiving({
    location,
    startDate,
    endDate,
    cardName,
}: Args) {
    try {
        const db = await getDatabaseConnection();

        const collection = await db.collection(
            collectionFromLocation(location).receivedCards
        );

        const pipeline = [];

        // Extract timestamp from _id and attach to all documents
        const addFields = {
            $addFields: {
                created_at: {
                    $toDate: '$_id',
                },
                // $lookup requires an ObjectId reference, so we convert it here
                user_id: {
                    $toObjectId: '$created_by',
                },
            },
        };

        // Match documents based on date
        const match = {
            $match: {
                created_at: {
                    $lte: endDate,
                    $gte: startDate,
                },
            },
        };

        pipeline.push(addFields);

        // Search on dates if both are provided
        if (startDate && endDate) {
            pipeline.push(match);
        }

        // Search on cardName if provided
        const cardNameMatch = {
            $match: {
                'received_card_list.name': cardName,
            },
        };

        if (cardName) {
            pipeline.push(cardNameMatch);
        }

        // Join users into the aggregation and replace created_by with user entity
        const lookup = {
            $lookup: {
                from: collectionFromLocation(location).users,
                localField: 'user_id',
                foreignField: '_id',
                as: 'created_by',
            },
        };

        pipeline.push(lookup);

        // Unwind the found user in the $lookup...it's an array
        pipeline.push({
            $unwind: '$created_by',
        });

        // Exclude password hash
        const project = {
            $project: {
                created_by: {
                    password: 0,
                },
            },
        };

        pipeline.push(project);

        pipeline.push({
            $sort: {
                created_at: -1,
            },
        });

        return await collection.aggregate(pipeline).toArray();
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default getCardsFromReceiving;
