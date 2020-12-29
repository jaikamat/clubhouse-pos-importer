import { MongoClient } from 'mongodb';
import collectionFromLocation from '../lib/collectionFromLocation';
import getDatabaseName from '../lib/getDatabaseName';
import mongoOptions from '../lib/mongoOptions';
const DATABASE_NAME = getDatabaseName();

// `finishCondition` Refers to the configuration of Finishes and Conditions ex. NONFOIL_NM or FOIL_LP
export default async function addCardToInventory({
    quantity,
    finishCondition,
    id,
    name,
    set_name,
    set,
    location,
}) {
    try {
        var client = await new MongoClient(
            process.env.MONGO_URI,
            mongoOptions
        ).connect();

        console.log(
            `Update Info: QTY:${quantity}, ${finishCondition}, ${name}, ${id}`
        );

        const db = client
            .db(DATABASE_NAME)
            .collection(collectionFromLocation(location).cardInventory);

        // Upsert the new quantity in the document
        await db.updateOne(
            { _id: id },
            {
                $inc: {
                    [`qoh.${finishCondition}`]: quantity,
                },
                $setOnInsert: { name, set_name, set },
            },
            { upsert: true }
        );

        // Validate inventory quantites to never be negative numbers
        await db.updateOne(
            {
                _id: id,
                [`qoh.${finishCondition}`]: { $lt: 0 },
            },
            {
                $set: { [`qoh.${finishCondition}`]: 0 },
            }
        );

        // Get the updated document for return
        return await db.findOne(
            { _id: id },
            {
                projection: {
                    _id: true,
                    qoh: true,
                    name: true,
                    setName: true,
                    set: true,
                },
            }
        );
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}
