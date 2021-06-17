import axios from 'axios';
import { GET_CARDS_BY_FILTER } from '../utils/api_resources';
import makeAuthHeader from '../utils/makeAuthHeader';
import { FinishCondition } from '../utils/ScryfallCard';

export interface Filters {
    title?: string;
    setName?: string;
    format?: string;
    price?: number;
    finish?: string;
    colors?: string;
    colorSpecificity?: string;
    type?: string;
    frame?: string;
    sortByDirection: number;
    priceOperator: string;
    sortBy: string;
}

type Params = Filters & { page: number };

export interface ResponseCard {
    _id: string;
    image_uri: string;
    name: string;
    price: number;
    rarity: string;
    set: string;
    set_name: string;
    finishCondition: FinishCondition;
    quantityInStock: number;
}

interface Response {
    cards: ResponseCard[];
    total: number;
}

const filteredCardsQuery = async (filters: Filters, page: number) => {
    const params: Params = { ...filters, page };

    const { data } = await axios.get<Response>(GET_CARDS_BY_FILTER, {
        params,
        headers: makeAuthHeader(),
    });

    return data;
};

export default filteredCardsQuery;
