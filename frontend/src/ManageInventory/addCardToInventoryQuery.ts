import axios from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';
import { ADD_CARD_TO_INVENTORY } from '../utils/api_resources';
import { QOH } from '../utils/ScryfallCard';

interface CardInfo {
    id: string;
    name: string;
    set_name: string;
    set: string;
}

interface Payload {
    quantity: number;
    finishCondition: string;
    cardInfo: CardInfo;
}

interface ResponseData {
    _id: string;
    name: string;
    set: string;
    qoh: Partial<QOH>;
}

const addCardToInventoryQuery = async (payload: Payload) => {
    try {
        const { data } = await axios.post<ResponseData>(
            ADD_CARD_TO_INVENTORY,
            payload,
            { headers: makeAuthHeader() }
        );

        return data;
    } catch (err) {
        throw err;
    }
};

export default addCardToInventoryQuery;
