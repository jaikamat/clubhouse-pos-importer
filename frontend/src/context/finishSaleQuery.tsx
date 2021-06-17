import axios from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';
import { FINISH_SALE } from '../utils/api_resources';
import { Trade } from './ReceivingContext';
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
        const { data } = await axios.post<ResponseData>(FINISH_SALE, payload, {
            headers: makeAuthHeader(),
        });

        return data;
    } catch (err) {
        throw err;
    }
};

export default finishSaleQuery;
