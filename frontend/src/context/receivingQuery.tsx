import http from '../common/http';
import { RECEIVE_CARDS } from '../utils/endpoints';
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
    customerName: string;
    customerContact: string | null;
}

const receivingQuery = async ({
    cards,
    customerName,
    customerContact,
}: Payload) => {
    try {
        // We do not expect to use the return type, so we designate it `void`
        const { data } = await http.post<void>(RECEIVE_CARDS, {
            cards,
            customerName,
            customerContact,
        });

        return data;
    } catch (err) {
        throw err;
    }
};

export default receivingQuery;
