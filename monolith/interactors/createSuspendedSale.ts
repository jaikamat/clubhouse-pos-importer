import { MongoClient } from 'mongodb';
import collectionFromLocation from '../lib/collectionFromLocation';
import getDatabaseName from '../lib/getDatabaseName';
import mongoOptions from '../lib/mongoOptions';
import { ClubhouseLocation } from './getJwt';
import updateCardInventoryWithFlag from './updateCardInventoryWithFlag';
const DATABASE_NAME = getDatabaseName();

/**
 * Validates a card's quantity-to-sell against available inventory
 * @param {object} saleListCard properties - the card sent from the frontend with relevant qtyToSell, finishCondition, and id properties attached
 */
async function validateInventory(
    { qtyToSell, finishCondition, name, id },
    location: ClubhouseLocation,
    databaseClient: MongoClient
) {
    try {
        const db = databaseClient
            .db(DATABASE_NAME)
            .collection(collectionFromLocation(location).cardInventory);

        const doc = await db.findOne({ _id: id });

        const quantityOnHand = doc.qoh[finishCondition];

        if (parseInt(qtyToSell) > parseInt(quantityOnHand)) {
            throw new Error(
                `${name}'s QOH of ${qtyToSell} exceeds inventory of ${quantityOnHand}`
            );
        }

        return true;
    } catch (e) {
        throw e;
    }
}

/**
 * Creates a suspended sale. Note that the DB has a TTL index on `createdAt` that wipes documents more than one week old
 * @param {string} customerName - Name of the customer
 * @param {string} notes - Optional notes
 * @param {array} saleList - The array of card objects used on the frontend - translated directly from React state
 */
async function createSuspendedSale(
    customerName,
    notes,
    saleList,
    location: ClubhouseLocation
) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        const db = client
            .db(DATABASE_NAME)
            .collection(collectionFromLocation(location).suspendedSales);

        console.log(`Creating new suspended sale at ${location}`);

        // Validate inventory prior to transacting
        const validations = saleList.map(
            async (card) => await validateInventory(card, location, client)
        );
        await Promise.all(validations);

        // Removes the passed cards from inventory prior to creating
        const dbInserts = saleList.map(
            async (card) =>
                await updateCardInventoryWithFlag(card, 'DEC', location, client)
        );
        await Promise.all(dbInserts);

        return await db.insertOne({
            createdAt: new Date(),
            name: customerName,
            notes: notes,
            list: saleList,
        });
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

export default createSuspendedSale;
