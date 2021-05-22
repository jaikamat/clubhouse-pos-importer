import { ClubhouseLocation } from './getJwt';
import collectionFromLocation from '../lib/collectionFromLocation';
import getDatabaseConnection from '../database';
import { ReceivingCard } from './addCardToInventoryReceiving';

async function addCardsToReceivingRecords(
    cards: ReceivingCard[],
    location: ClubhouseLocation
) {
    try {
        const db = await getDatabaseConnection();

        // TODO: test to make sure cards at ch2 get received

        await db
            .collection(collectionFromLocation(location).receivedCards)
            .insertOne({
                created_at: new Date(),
                received_card_list: cards,
            });

        console.log(`Recorded ${cards.length} received cards at ${location}`);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default addCardsToReceivingRecords;
