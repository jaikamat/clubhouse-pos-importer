import axios from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';
import { SUSPEND_SALE } from '../utils/api_resources';
import { InventoryCard } from '../utils/ScryfallCard';

export interface SuspendedSale {
    _id: string;
    name: string;
    notes: string;
    list: SaleListCard[];
}

export type SaleListCard = InventoryCard & {
    finishCondition: string;
    qtyToSell: number;
    price: number;
};

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
