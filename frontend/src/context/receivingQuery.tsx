import axios from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';
import { RECEIVE_CARDS } from '../utils/api_resources';
import { Trade } from './ReceivingContext';

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
        // We do not expect to use the return type, so we designate it `void`
        const { data } = await axios.post<void>(
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
