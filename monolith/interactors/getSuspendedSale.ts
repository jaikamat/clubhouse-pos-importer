import { ObjectID } from 'mongodb';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';

/**
 * Retrieves one suspended sale
 * @param {string} id
 */
async function getSuspendedSale(id, location) {
    try {
        const db = await getDatabaseConnection();
        const doc = await db
            .collection(collectionFromLocation(location).suspendedSales)
            .findOne({ _id: new ObjectID(id) });

        return doc;
    } catch (e) {
        throw e;
    }
}

export default getSuspendedSale;
