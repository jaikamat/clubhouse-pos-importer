import { ClubhouseLocation, QOH } from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';

interface CardInventory {
    _id: string;
    name: string;
    qoh: QOH;
    set: string;
    set_name: string;
}

/**
 * Retrieves an inventory document for a given card id
 */
async function findInventoryById(
    id: string,
    location: ClubhouseLocation
): Promise<CardInventory> {
    try {
        const db = await getDatabaseConnection();
        const collection = db.collection(
            collectionFromLocation(location).cardInventory
        );

        const doc = await collection.findOne({ _id: id });

        return doc;
    } catch (e) {
        throw e;
    }
}

export default findInventoryById;
