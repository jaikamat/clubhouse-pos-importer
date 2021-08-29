import http from '../common/http';
import { SUSPEND_SALE } from '../utils/api_resources';
import { SaleListCard } from './SaleContext';

export interface SuspendedSale {
    _id: string;
    name: string;
    notes: string;
    list: SaleListCard[];
}

const getSuspendedSaleQuery = async (saleId: string) => {
    try {
        const { data } = await http.get<SuspendedSale>(
            `${SUSPEND_SALE}/${saleId}`
        );

        return data;
    } catch (err) {
        throw err;
    }
};

export default getSuspendedSaleQuery;
