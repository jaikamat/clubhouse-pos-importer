import { ObjectID } from 'mongodb';
import { ClubhouseLocation } from '../common/types';
import getDatabaseConnection from '../database';
import collectionFromLocation from '../lib/collectionFromLocation';
import updateCardInventory from './updateCardInventory';

/**
 * Deletes a single suspended sale
 * @param {string} id
 */
async function deleteSuspendedSale(id: string, location: ClubhouseLocation) {
    try {
        const db = await getDatabaseConnection();
        const collection = db.collection(
            collectionFromLocation(location).suspendedSales
        );

        console.log(`Deleting suspended sale _id: ${id} at ${location}`);

        const { list } = await collection.findOne({ _id: new ObjectID(id) });

        // Adds the passed cards back to inventory prior to deleting
        const dbInserts = list.map(
            async (card) =>
                await updateCardInventory(
                    { ...card, qtyToSell: Math.abs(card.qtyToSell) },
                    location
                )
        );
        await Promise.all(dbInserts);

        return await collection.deleteOne({ _id: new ObjectID(id) });
    } catch (e) {
        throw e;
    }
}

export default deleteSuspendedSale;
