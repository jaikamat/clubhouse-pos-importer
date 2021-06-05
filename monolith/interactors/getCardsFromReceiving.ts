import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';
import { ClubhouseLocation } from './getJwt';

async function getCardsFromReceiving(
    employeeNumber: number,
    location: ClubhouseLocation,
    startDate: Date | null,
    endDate: Date | null
) {
    try {
        const db = await getDatabaseConnection();

        const collection = await db.collection(
            collectionFromLocation(location).receivedCards
        );

        const pipeline = [];

        const addFields = {
            $addFields: {
                created_at: {
                    $toDate: '$_id',
                },
            },
        };

        // TODO: match based on dates
        const match = {};

        pipeline.push(addFields);
        // pipeline.push(match);

        return await collection.aggregate(pipeline).toArray();
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default getCardsFromReceiving;
