import http from '../common/http';
import { FINISH_SALE } from '../utils/api_resources';
import { SaleListCard } from './SaleContext';

interface Payload {
    cards: SaleListCard[];
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
