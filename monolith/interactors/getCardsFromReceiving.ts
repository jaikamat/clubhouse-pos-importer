import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';
import { ClubhouseLocation } from './getJwt';

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

        if (cardName !== null) {
            pipeline.push(cardNameMatch);
        }

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
