import { ClubhouseLocation } from './getJwt';
import getDatabaseName from '../lib/getDatabaseName';
import { MongoClient } from 'mongodb';
import collectionFromLocation from '../lib/collectionFromLocation';
import mongoOptions from '../lib/mongoOptions';
const DATABASE_NAME = getDatabaseName();

/**
 * Updates card inventory based on the card's passed properties (qtyToSell, finishCondition, id, name) and CHANGE_FLAG
 * @param {Object} card - the card involved in the transaction
 * @param {String} CHANGE_FLAG = `INC` or `DEC`, determines whether to increase or decrease quantity, used for reserving inventory in suspension
 */
async function updateCardInventoryWithFlag(
    card,
    CHANGE_FLAG,
    location: ClubhouseLocation
) {
    const { qtyToSell, finishCondition, id, name } = card;
    let quantityChange;

    if (CHANGE_FLAG === 'DEC') {
        quantityChange = -Math.abs(qtyToSell);
    } else if (CHANGE_FLAG === 'INC') {
        quantityChange = Math.abs(qtyToSell);
    } else {
        throw new Error('CHANGE_FLAG was not provided');
    }

    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        console.log(
            `Suspend sale, ${CHANGE_FLAG}: QTY: ${qtyToSell}, ${finishCondition}, ${name}, ${id}, LOCATION: ${location}`
        );

        const db = client
            .db(DATABASE_NAME)
            .collection(collectionFromLocation(location).cardInventory);

        await db.updateOne(
            { _id: id },
            {
                $inc: {
                    [`qoh.${finishCondition}`]: quantityChange,
                },
            }
        );

        // Validate inventory quantites to never be negative numbers
        return await db.updateOne(
            {
                _id: id,
                [`qoh.${finishCondition}`]: { $lt: 0 },
            },
            { $set: { [`qoh.${finishCondition}`]: 0 } }
        );
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

export default updateCardInventoryWithFlag;
