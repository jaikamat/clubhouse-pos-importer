import { ClubhouseLocation } from '../common/types';
import getInventoryCardModel from '../models/InventoryCardModel';
import { InventoryCard } from '../schemas/InventoryCardSchema';

type Card = {
    quantity: number;
    finishCondition: string;
    id: string;
    name: string;
    set_name: string;
    set: string;
    location: ClubhouseLocation;
};

// `finishCondition` Refers to the configuration of Finishes and Conditions ex. NONFOIL_NM or FOIL_LP
export default async function addCardToInventory({
    quantity,
    finishCondition,
    id,
    name,
    set_name,
    set,
    location,
}: Card): Promise<InventoryCard> {
    try {
        console.log(
            `Update Info: QTY:${quantity}, ${finishCondition}, ${name}, ${id}, LOCATION: ${location}`
        );

        const InventoryCardModel = getInventoryCardModel(location);

        const targetQoh = `qoh.${finishCondition}`;

        // Upsert the new quantity in the document
        await InventoryCardModel.findOneAndUpdate(
            { _id: id },
            {
                $inc: { [targetQoh]: quantity },
                $setOnInsert: { name, set_name, set },
            },
            { upsert: true }
        ).exec();

        // Validate inventory quantities to never be negative numbers
        await InventoryCardModel.updateOne(
            { _id: id, [targetQoh]: { $lt: 0 } },
            { $set: { [targetQoh]: 0 } }
        ).exec();

        return await InventoryCardModel.findById(id).exec();
    } catch (err) {
        console.log(err);
        throw err;
    }
}
