import mongoose from 'mongoose';
import { ClubhouseLocation } from '../common/types';
import collectionFromLocation from '../lib/collectionFromLocation';

/**
 * Gets a list of all set names, for use in the Deckbox frontend dropdown selection
 */
async function getDistinctSetNames(
    location: ClubhouseLocation
): Promise<string[]> {
    try {
        const db = await mongoose.connection.db;
        const collection = db.collection(
            collectionFromLocation(location).cardInventory
        );

        return await collection.distinct('set_name');
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default getDistinctSetNames;
