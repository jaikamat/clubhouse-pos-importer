import moment from 'moment';
import { ClubhouseLocation } from '../common/types';
import getReceivedCardsModel from '../models/ReceivedCardsModel';
import { ReceivingCard } from './addCardToInventoryReceiving';

interface Args {
    cards: ReceivingCard[];
    employeeNumber: number;
    location: ClubhouseLocation;
    userId: string;
    customerName: string;
    customerContact: string | null;
}

async function addCardsToReceivingRecords({
    cards,
    employeeNumber,
    location,
    userId,
    customerName,
    customerContact,
}: Args) {
    try {
        const ReceivedCardsModel = getReceivedCardsModel(location);

        await ReceivedCardsModel.create({
            created_at: moment().utc().toDate(),
            employee_number: employeeNumber,
            received_card_list: cards,
            created_by: userId,
            customer_name: customerName,
            customer_contact: customerContact,
        });

        console.log(`Recorded ${cards.length} received cards at ${location}`);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default addCardsToReceivingRecords;
