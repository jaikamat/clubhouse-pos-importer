import axios from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';
import { RECEIVE_CARDS } from '../utils/api_resources';
import { Trade } from './ReceivingContext';

// TODO: We should type this
interface Response {
    data: any;
}

interface ReceivingQueryCard {
    quantity: number;
    finishCondition: string;
    id: string;
    name: string;
    set_name: string;
    set: string;
    marketPrice: number | null;
    cashPrice: number | null;
    creditPrice: number | null;
    tradeType: Trade;
}

interface Payload {
    cards: ReceivingQueryCard[];
}

const receivingQuery = async ({ cards }: Payload) => {
    try {
        const { data }: Response = await axios.post(
            RECEIVE_CARDS,
            { cards },
            { headers: makeAuthHeader() }
        );

        return data;
    } catch (err) {
        throw err;
    }
};

export default receivingQuery;
