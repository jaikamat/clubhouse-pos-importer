import { ObjectID } from 'mongodb';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';

async function getReceivingById(id, location) {
    try {
        const db = await getDatabaseConnection();
        const doc = await db
            .collection(collectionFromLocation(location).receivedCards)
            .findOne({ _id: new ObjectID(id) });

        return doc;
    } catch (e) {
        throw e;
    }
}

export default getReceivingById;
