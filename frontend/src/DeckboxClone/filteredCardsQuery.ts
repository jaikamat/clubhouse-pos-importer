import axios from 'axios';
import { GET_CARDS_BY_FILTER } from '../utils/api_resources';
import makeAuthHeader from '../utils/makeAuthHeader';

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

interface Response {
    data: any[];
}

type Params = Filters & { page: number };

const filteredCardsQuery = async (filters: Filters, page: number) => {
    const params: Params = { ...filters, page };

    const { data } = await axios.get<Response>(GET_CARDS_BY_FILTER, {
        params,
        headers: makeAuthHeader(),
    });

    return data;
};

export default filteredCardsQuery;
