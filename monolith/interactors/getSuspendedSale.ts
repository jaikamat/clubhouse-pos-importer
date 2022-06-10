import mongoose from 'mongoose';
import collectionFromLocation from '../lib/collectionFromLocation';

/**
 * Retrieves one suspended sale
 * @param {string} id
 */
async function getSuspendedSale(id, location) {
    try {
        const db = await mongoose.connection.db;
        const doc = await db
            .collection(collectionFromLocation(location).suspendedSales)
            .findOne({ _id: new mongoose.Types.ObjectId(id) });

        return doc;
    } catch (e) {
        throw e;
    }
}

export default getSuspendedSale;
