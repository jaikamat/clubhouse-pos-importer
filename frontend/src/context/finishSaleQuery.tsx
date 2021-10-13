import http from '../common/http';
import { FinishCondition } from '../utils/ClientCard';
import { FINISH_SALE } from '../utils/endpoints';

interface QueryCard {
    id: string;
    price: number;
    qtyToSell: number;
    name: string;
    set_name: string;
    finishCondition: FinishCondition;
}

interface Payload {
    cards: QueryCard[];
}

interface ResponseData {
    sale_data: {
        Sale: {
            saleID: string;
        };
    };
}

const finishSaleQuery = async (payload: Payload) => {
    try {
        const { data } = await http.post<ResponseData>(FINISH_SALE, payload);

        return data;
    } catch (err) {
        throw err;
    }
};

export default finishSaleQuery;
