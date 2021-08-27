import axios from 'axios';
import { SaleListCard } from '../context/SaleContext';
import { GET_SALES_BY_TITLE } from '../utils/api_resources';
import makeAuthHeader from '../utils/makeAuthHeader';

interface SaleData {
    total: string;
    saleID: string;
    timeStamp: string;
    createTime: string;
}

export interface Sale {
    _id: string;
    sale_data: SaleData;
    card_list: SaleListCard[];
}

interface Payload {
    cardName: string;
}

const browseSalesQuery = async ({ cardName }: Payload) => {
    try {
        const { data } = await axios.get<Sale[]>(GET_SALES_BY_TITLE, {
            params: { cardName: cardName },
            headers: makeAuthHeader(),
        });
        return data;
    } catch (err) {
        throw err;
    }
};

export default browseSalesQuery;
