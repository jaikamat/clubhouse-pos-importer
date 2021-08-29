import http from '../common/http';
import { SaleListCard } from '../context/SaleContext';
import { GET_SALES_BY_TITLE } from '../utils/api_resources';

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
        const { data } = await http.get<Sale[]>(GET_SALES_BY_TITLE, {
            params: { cardName: cardName },
        });
        return data;
    } catch (err) {
        throw err;
    }
};

export default browseSalesQuery;
