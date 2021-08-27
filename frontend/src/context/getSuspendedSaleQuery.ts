import axios from 'axios';
import { SUSPEND_SALE } from '../utils/api_resources';
import makeAuthHeader from '../utils/makeAuthHeader';
import { SaleListCard } from './SaleContext';

export interface SuspendedSale {
    _id: string;
    name: string;
    notes: string;
    list: SaleListCard[];
}

const getSuspendedSaleQuery = async (saleId: string) => {
    try {
        const { data } = await axios.get<SuspendedSale>(
            `${SUSPEND_SALE}/${saleId}`,
            {
                headers: makeAuthHeader(),
            }
        );

        return data;
    } catch (err) {
        throw err;
    }
};

export default getSuspendedSaleQuery;
