import mongoose from 'mongoose';
import { ClubhouseLocation, FinishSaleCard } from '../common/types';
import collectionFromLocation from '../lib/collectionFromLocation';

/**
 * Updates card inventory based on the card's passed properties (qtyToSell, finishCondition, id, name) and CHANGE_FLAG
 * @param {Object} card - the card involved in the transaction
 * @param {String} CHANGE_FLAG = `INC` or `DEC`, determines whether to increase or decrease quantity, used for reserving inventory in suspension
 */
async function updateCardInventory(
    card: FinishSaleCard,
    location: ClubhouseLocation
) {
    const { qtyToSell, finishCondition, id, name } = card;

    try {
        console.log(
            `Suspend sale, QTY: ${qtyToSell}, ${finishCondition}, ${name}, ${id}, LOCATION: ${location}`
        );

        const db = mongoose.connection.db;
        const collection = db.collection(
            collectionFromLocation(location).cardInventory
        );

        await collection.updateOne(
            { _id: id },
            {
                $inc: {
                    [`qoh.${finishCondition}`]: qtyToSell,
                },
            }
        );

        // Validate inventory quantites to never be negative numbers
        return await collection.updateOne(
            {
                _id: id,
                [`qoh.${finishCondition}`]: { $lt: 0 },
            },
            { $set: { [`qoh.${finishCondition}`]: 0 } }
        );
    } catch (e) {
        throw e;
    }
}

export default updateCardInventory;
