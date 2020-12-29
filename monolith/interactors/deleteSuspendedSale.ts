import { MongoClient, ObjectID } from 'mongodb';
import collectionFromLocation from '../lib/collectionFromLocation';
import getDatabaseName from '../lib/getDatabaseName';
import mongoOptions from '../lib/mongoOptions';
import updateCardInventoryWithFlag from './updateCardInventoryWithFlag';
const DATABASE_NAME = getDatabaseName();

/**
 * Deletes a single suspended sale
 * @param {string} id
 */
async function deleteSuspendedSale(id, location) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        const db = client
            .db(DATABASE_NAME)
            .collection(collectionFromLocation(location).suspendedSales);

        console.log(`Deleting suspended sale _id: ${id} at ${location}`);

        const { list } = await db.findOne({ _id: new ObjectID(id) });

        // Adds the passed cards back to inventory prior to deleting
        const dbInserts = list.map(
            async (card) =>
                await updateCardInventoryWithFlag(card, 'INC', location)
        );
        await Promise.all(dbInserts);

        return await db.deleteOne({ _id: new ObjectID(id) });
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

export default deleteSuspendedSale;
