import collectionFromLocation from '../lib/collectionFromLocation';
import getDatabaseConnection from '../database';
import { ClubhouseLocation, QOH } from '../common/types';

type Card = {
    quantity: number;
    finishCondition: string;
    id: string;
    name: string;
    set_name: string;
    set: string;
    location: ClubhouseLocation;
};

interface ReturnCard {
    _id: string;
    name: string;
    qoh: QOH;
    set: string;
}

// `finishCondition` Refers to the configuration of Finishes and Conditions ex. NONFOIL_NM or FOIL_LP
export default async function addCardToInventory({
    quantity,
    finishCondition,
    id,
    name,
    set_name,
    set,
    location,
}: Card): Promise<ReturnCard> {
    try {
        const db = await getDatabaseConnection();
        const collection = db.collection(
            collectionFromLocation(location).cardInventory
        );

        console.log(
            `Update Info: QTY:${quantity}, ${finishCondition}, ${name}, ${id}, LOCATION: ${location}`
        );

        // Upsert the new quantity in the document
        await collection.updateOne(
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
        await collection.updateOne(
            {
                _id: id,
                [`qoh.${finishCondition}`]: { $lt: 0 },
            },
            {
                $set: { [`qoh.${finishCondition}`]: 0 },
            }
        );

        // Get the updated document for return
        return await collection.findOne(
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
    }
}
