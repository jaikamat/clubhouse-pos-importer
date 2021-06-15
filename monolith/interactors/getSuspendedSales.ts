import collectionFromLocation from '../lib/collectionFromLocation';
import getDatabaseConnection from '../database';
import { ClubhouseLocation } from '../common/types';

/**
 * Returns all suspended sales' ids, customer names, and notes (omitting card lists)
 */
async function getSuspendedSales(location: ClubhouseLocation) {
    try {
        const db = await getDatabaseConnection();

        const docs = await db
            .collection(collectionFromLocation(location).suspendedSales)
            .find(
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
    }
}

export default getSuspendedSales;
