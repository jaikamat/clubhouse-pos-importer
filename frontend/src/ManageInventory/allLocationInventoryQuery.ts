import axios from 'axios';
import { GET_CARD_FROM_ALL_LOCATIONS } from '../utils/api_resources';

interface Quantities {
    foilQty: number;
    nonfoilQty: number;
}

export interface Response {
    data: {
        ch1: Quantities;
        ch2: Quantities;
    };
}

interface Payload {
    title: string;
}

/**
 * Fetches total inventory for the given card name across all store locations
 */
const allLocationInventoryQuery = async ({ title }: Payload) => {
    try {
        const { data }: Response = await axios.get(
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
