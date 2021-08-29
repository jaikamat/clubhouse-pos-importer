import http from '../common/http';
import { ClubhouseLocation } from '../context/AuthProvider';
import { Trade } from '../context/ReceivingContext';
import { RECEIVING } from '../utils/api_resources';
import { FinishCondition } from '../utils/ScryfallCard';

export interface ReceivedCard {
    quantity: number;
    marketPrice: number;
    cashPrice: number;
    creditPrice: number;
    tradeType: Trade;
    finishCondition: FinishCondition;
    id: string;
    name: string;
    set_name: string;
    set: string;
}

interface ReceivedUser {
    _id: string;
    lightspeedEmployeeNumber: number;
    locations: ClubhouseLocation[];
    username: string;
}

export interface Received {
    _id: string;
    created_at: string;
    employee_number: string;
    received_card_list: ReceivedCard[];
    created_by: ReceivedUser;
    customer_name: string | null;
    customer_contact: string | null;
}

interface Payload {
    cardName: string | null;
    startDate: string | null;
    endDate: string | null;
}

const browseReceivingQuery = async ({
    cardName,
    startDate,
    endDate,
}: Payload) => {
    try {
        const { data } = await http.get<Received[]>(RECEIVING, {
            params: { cardName, startDate, endDate },
        });
        return data;
    } catch (err) {
        throw err;
    }
};

export default browseReceivingQuery;
