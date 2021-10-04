import http from '../common/http';
import { FinishCondition } from '../utils/ClientCard';
import { SUSPEND_SALE } from '../utils/endpoints';

interface FinishSaleCard {
    id: string;
    price: number;
    qtyToSell: number;
    finishCondition: FinishCondition;
    name: string;
    set_name: string;
}

interface Payload {
    customerName: string;
    notes: string;
    saleList: FinishSaleCard[];
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
