import axios from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';
import { SUSPEND_SALE } from '../utils/api_resources';
import { SaleListCard } from './SaleContext';

interface Payload {
    customerName: string;
    notes: string;
    saleList: SaleListCard[];
}

interface ResponseData {
    ops: [{ name: string }];
}

const createSuspendedSaleQuery = async (payload: Payload) => {
    try {
        const { data } = await axios.post<ResponseData>(SUSPEND_SALE, payload, {
            headers: makeAuthHeader(),
        });

        return data;
    } catch (err) {
        throw err;
    }
};

export default createSuspendedSaleQuery;
