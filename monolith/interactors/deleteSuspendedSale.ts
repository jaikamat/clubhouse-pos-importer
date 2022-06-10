import mongoose from 'mongoose';
import { ClubhouseLocation } from '../common/types';
import collectionFromLocation from '../lib/collectionFromLocation';
import updateCardInventory from './updateCardInventory';

/**
 * Deletes a single suspended sale
 * @param {string} id
 */
async function deleteSuspendedSale(id: string, location: ClubhouseLocation) {
    try {
        const db = await mongoose.connection.db;
        const collection = db.collection(
            collectionFromLocation(location).suspendedSales
        );

        console.log(`Deleting suspended sale _id: ${id} at ${location}`);

        const { list } = await collection.findOne({
            _id: new mongoose.Types.ObjectId(id),
        });

        // Adds the passed cards back to inventory prior to deleting
        const dbInserts = list.map(
            async (card) =>
                await updateCardInventory(
                    { ...card, qtyToSell: Math.abs(card.qtyToSell) },
                    location
                )
        );
        await Promise.all(dbInserts);

        return await collection.deleteOne({
            _id: new mongoose.Types.ObjectId(id),
        });
    } catch (e) {
        throw e;
    }
}

export default deleteSuspendedSale;
