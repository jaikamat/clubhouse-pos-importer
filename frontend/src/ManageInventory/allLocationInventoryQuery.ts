import axios from 'axios';
import { GET_CARD_FROM_ALL_LOCATIONS } from '../utils/endpoints';

interface Quantities {
    foilQty: number;
    nonfoilQty: number;
    etchedQty: number;
}

export interface ResponseData {
    ch1: Quantities;
    ch2: Quantities;
}

interface Payload {
    title: string;
}

/**
 * Fetches total inventory for the given card name across all store locations
 */
const allLocationInventoryQuery = async ({ title }: Payload) => {
    try {
        const { data } = await axios.get<ResponseData>(
            GET_CARD_FROM_ALL_LOCATIONS,
            {
                params: { title },
            }
        );

        return data;
    } catch (err) {
        throw err;
    }
};

export default allLocationInventoryQuery;
