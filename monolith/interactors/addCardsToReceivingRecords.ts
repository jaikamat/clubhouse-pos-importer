import collectionFromLocation from '../lib/collectionFromLocation';
import getDatabaseConnection from '../database';
import { ReceivingCard } from './addCardToInventoryReceiving';
import { ClubhouseLocation } from '../common/types';

async function addCardsToReceivingRecords(
    cards: ReceivingCard[],
    employeeNumber: number,
    location: ClubhouseLocation,
    userId: string
) {
    try {
        const db = await getDatabaseConnection();

        await db
            .collection(collectionFromLocation(location).receivedCards)
            .insertOne({
                created_at: new Date(),
                employee_number: employeeNumber,
                received_card_list: cards,
                created_by: userId,
            });

        console.log(`Recorded ${cards.length} received cards at ${location}`);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default addCardsToReceivingRecords;
