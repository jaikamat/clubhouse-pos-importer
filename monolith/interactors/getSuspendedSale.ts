import { MongoClient, ObjectID } from 'mongodb';
import collectionFromLocation from '../lib/collectionFromLocation';
import getDatabaseName from '../lib/getDatabaseName';
import mongoOptions from '../lib/mongoOptions';
const DATABASE_NAME = getDatabaseName();

/**
 * Retrieves one suspended sale
 * @param {string} id
 */
async function getSuspendedSale(id, location) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        const db = client
            .db(DATABASE_NAME)
            .collection(collectionFromLocation(location).suspendedSales);
        const doc = await db.findOne({ _id: new ObjectID(id) });

        return doc;
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

export default getSuspendedSale;
