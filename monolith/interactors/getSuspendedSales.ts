import { MongoClient } from 'mongodb';
import { ClubhouseLocation } from './getJwt';
import getDatabaseName from '../lib/getDatabaseName';
import collectionFromLocation from '../lib/collectionFromLocation';
import mongoOptions from '../lib/mongoOptions';
const DATABASE_NAME = getDatabaseName();

/**
 * Returns all suspended sales' ids, customer names, and notes (omitting card lists)
 */
async function getSuspendedSales(location: ClubhouseLocation) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        const db = client
            .db(DATABASE_NAME)
            .collection(collectionFromLocation(location).suspendedSales);

        const docs = await db.find(
            {},
            {
                projection: {
                    _id: 1,
                    createdAt: 1,
                    name: 1,
                    notes: 1,
                },
            }
        );

        return await docs.toArray();
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

export default getSuspendedSales;
