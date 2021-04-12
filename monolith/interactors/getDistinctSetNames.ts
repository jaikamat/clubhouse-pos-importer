import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';
import { ClubhouseLocation } from './getJwt';

/**
 * Gets a list of all set names, for use in the Deckbox frontend dropdown selection
 */
async function getDistinctSetNames(
    location: ClubhouseLocation
): Promise<string[]> {
    try {
        const db = await getDatabaseConnection();
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
