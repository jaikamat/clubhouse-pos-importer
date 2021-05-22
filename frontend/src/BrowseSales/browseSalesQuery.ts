import axios from 'axios';
import { FinishCondition } from '../utils/ScryfallCard';
import makeAuthHeader from '../utils/makeAuthHeader';
import { GET_SALES_BY_TITLE } from '../utils/api_resources';

interface SaleData {
    total: string;
    saleID: string;
    timeStamp: string;
    createTime: string;
}

interface SaleCard {
    foil: boolean;
    nonfoil: boolean;
    id: string;
    name: string;
    set: string;
    set_name: string;
    rarity: string;
    reserved: true;
    finishCondition: FinishCondition;
    price: string | number;
    qtyToSell: string | number;
    card_faces: string | number;
}

export interface Sale {
    _id: string;
    sale_data: SaleData;
    card_list: SaleCard[];
}

interface Response {
    data: Sale[];
}

interface Payload {
    cardName: string;
}

const browseSalesQuery = async (payload: Payload) => {
    try {
        const { cardName } = payload;

        const { data }: Response = await axios.get(GET_SALES_BY_TITLE, {
            params: { cardName: cardName },
            headers: makeAuthHeader(),
        });
        return data;
    } catch (err) {
        throw err;
    }
};

export default browseSalesQuery;
