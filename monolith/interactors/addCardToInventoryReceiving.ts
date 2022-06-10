import { ClubhouseLocation, FinishCondition, Trade } from '../common/types';
import getInventoryCardModel from '../models/InventoryCardModel';

export type ReceivingCard = {
    quantity: number;
    finishCondition: FinishCondition;
    id: string;
    name: string;
    set_name: string;
    set: string;
    creditPrice: number | null;
    cashPrice: number | null;
    marketPrice: number | null;
    tradeType: Trade;
};

// `finishCondition` Refers to the configuration of Finishes and Conditions ex. NONFOIL_NM or FOIL_LP
async function addCardToInventoryReceiving(
    { quantity, finishCondition, id, name, set_name, set }: ReceivingCard,
    location: ClubhouseLocation
) {
    try {
        console.log(
            `Receiving Info: QTY:${quantity}, ${finishCondition}, ${name}, ${id}`
        );

        const InventoryCardModel = getInventoryCardModel(location);

        // Upsert the new quantity in the document
        return await InventoryCardModel.updateOne(
            { _id: id },
            {
                $inc: { [`qoh.${finishCondition}`]: quantity },
                $setOnInsert: { name, set_name, set },
            },
            { upsert: true }
        ).exec();
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
        const operations = cards.map(async (receivingCard) => {
            return addCardToInventoryReceiving(receivingCard, location);
        });

        const messages = await Promise.all(operations);

        console.log(`Receiving cards at ${location}`);

        return messages;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default wrapAddCardToInventoryReceiving;
