import http from '../common/http';
import { FinishCondition } from '../utils/ClientCard';
import { GET_CARDS_BY_FILTER } from '../utils/endpoints';

export interface Filters {
    title?: string;
    setName?: string;
    format?: string;
    minPrice?: number;
    maxPrice?: number;
    finish?: string;
    colors?: string[];
    colorSpecificity?: string;
    type?: string;
    frame?: string;
    sortByDirection: number;
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

interface ResponseData {
    cards: ResponseCard[];
    total: number;
}

const filteredCardsQuery = async (filters: Filters, page: number) => {
    const params: Params = { ...filters, page };

    const { data } = await http.get<ResponseData>(GET_CARDS_BY_FILTER, {
        params,
    });

    return data;
};

export default filteredCardsQuery;
