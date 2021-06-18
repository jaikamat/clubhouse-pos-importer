import axios from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';
import { ScryfallCard } from '../utils/ScryfallCard';
import { GET_CARDS_WITH_INFO } from '../utils/api_resources';

interface Payload {
    cardName: string;
    inStockOnly: boolean;
}

/**
 * Fetches cards from the DB by title when a user selects a title after querying.
 * This function merges the data (inventory quantity and card objects) from two endpoints into one array.
 */
const cardSearchQuery = async ({ cardName, inStockOnly }: Payload) => {
    try {
        const { data } = await axios.get<ScryfallCard[]>(GET_CARDS_WITH_INFO, {
            params: {
                title: cardName,
                matchInStock: inStockOnly,
            },
            headers: makeAuthHeader(),
        });

        return data;
    } catch (err) {
        throw err;
    }
};

export default cardSearchQuery;
