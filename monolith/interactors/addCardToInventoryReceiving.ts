import { MongoClient } from 'mongodb';
import { ClubhouseLocation } from './getJwt';
import getDatabaseName from '../lib/getDatabaseName';
import collectionFromLocation from '../lib/collectionFromLocation';
import mongoOptions from '../lib/mongoOptions';
const DATABASE_NAME = getDatabaseName();

type Card = {
    quantity: number;
    finishCondition: string;
    id: string;
    name: string;
    set_name: string;
    set: string;
};

// `finishCondition` Refers to the configuration of Finishes and Conditions ex. NONFOIL_NM or FOIL_LP
async function addCardToInventoryReceiving(
    { quantity, finishCondition, id, name, set_name, set }: Card,
    database
) {
    try {
        console.log(
            `Receiving Info: QTY:${quantity}, ${finishCondition}, ${name}, ${id}`
        );

        // Upsert the new quantity in the document
        return await database.updateOne(
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
    cards: Card[],
    location: ClubhouseLocation
) {
    try {
        var client = await new MongoClient(
            process.env.MONGO_URI,
            mongoOptions
        ).connect();

        const db = client
            .db(DATABASE_NAME)
            .collection(collectionFromLocation(location).cardInventory);

        const promises = cards.map(async (c) =>
            addCardToInventoryReceiving(c, db)
        );

        const messages = await Promise.all(promises);

        console.log(`Receiving cards at ${location}`);

        return messages;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}

export default wrapAddCardToInventoryReceiving;
