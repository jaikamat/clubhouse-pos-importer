import axios from 'axios';
import { FinishCondition } from '../utils/ScryfallCard';
import makeAuthHeader from '../utils/makeAuthHeader';
import { GET_RECEIVING_LIST } from '../utils/api_resources';
import { Trade } from '../context/ReceivingContext';

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

export interface Received {
    _id: string;
    created_at: string;
    employee_number: string;
    received_card_list: ReceivedCard[];
}

interface Response {
    data: Received[];
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
        const { data }: Response = await axios.get(GET_RECEIVING_LIST, {
            // TODO: pass date params
            params: { cardName },
            headers: makeAuthHeader(),
        });
        return data;
    } catch (err) {
        throw err;
    }
};

export default browseReceivingQuery;
