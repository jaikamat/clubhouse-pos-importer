import { Collection } from 'mongodb';
import { ClubhouseLocation } from './getJwt';
import collectionFromLocation from '../lib/collectionFromLocation';
import getDatabaseConnection from '../database';
import addCardsToReceivingRecords from './addCardsToReceivingRecords';

export type ReceivingCard = {
    quantity: number;
    finishCondition: string;
    id: string;
    name: string;
    set_name: string;
    set: string;
    credit_price: number | null;
    cash_price: number | null;
    market_price: number | null;
};

// `finishCondition` Refers to the configuration of Finishes and Conditions ex. NONFOIL_NM or FOIL_LP
async function addCardToInventoryReceiving(
    { quantity, finishCondition, id, name, set_name, set }: ReceivingCard,
    collection: Collection
) {
    try {
        console.log(
            `Receiving Info: QTY:${quantity}, ${finishCondition}, ${name}, ${id}`
        );

        // Upsert the new quantity in the document
        return await collection.updateOne(
            { _id: id },
            {
                $inc: {
                    [`qoh.${finishCondition}`]: quantity,
                },
                $setOnInsert: { name, set_name, set },
            },
            { upsert: true }
        );
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// Wraps the database connection and exposes addCardToInventoryReceiving to the db connection
async function wrapAddCardToInventoryReceiving(
    cards: ReceivingCard[],
    location: ClubhouseLocation
) {
    try {
        const db = await getDatabaseConnection();

        const collection = db.collection(
            collectionFromLocation(location).cardInventory
        );

        const promises = cards.map(async (c) =>
            addCardToInventoryReceiving(c, collection)
        );

        const messages = await Promise.all(promises);

        await addCardsToReceivingRecords(cards, location);

        console.log(`Receiving cards at ${location}`);

        return messages;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default wrapAddCardToInventoryReceiving;
