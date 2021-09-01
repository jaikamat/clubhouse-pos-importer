import http from '../common/http';
import { SUSPEND_SALE } from '../utils/endpoints';
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
        const { data } = await http.post<ResponseData>(SUSPEND_SALE, payload);

        return data;
    } catch (err) {
        throw err;
    }
};

export default createSuspendedSaleQuery;
