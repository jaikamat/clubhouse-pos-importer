import http from '../common/http';
import { FinishCondition, QOH } from '../utils/ClientCard';
import { ADD_CARD_TO_INVENTORY } from '../utils/endpoints';

interface CardInfo {
    id: string;
    name: string;
    set_name: string;
    set: string;
}

interface Payload {
    quantity: number;
    finishCondition: FinishCondition;
    cardInfo: CardInfo;
}

interface ResponseData {
    _id: string;
    name: string;
    set: string;
    qoh: QOH;
}

const addCardToInventoryQuery = async (payload: Payload) => {
    try {
        const { data } = await http.post<ResponseData>(
            ADD_CARD_TO_INVENTORY,
            payload
        );

        return data;
    } catch (err) {
        throw err;
    }
};

export default addCardToInventoryQuery;
