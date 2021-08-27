import axios from 'axios';
import { GET_CARDS_WITH_INFO } from '../utils/api_resources';
import makeAuthHeader from '../utils/makeAuthHeader';
import { ScryfallApiCard, ScryfallCard } from '../utils/ScryfallCard';

interface Params {
    cardName: string;
    inStockOnly: boolean;
}

/**
 * Fetches cards from the DB by title when a user selects a title after querying.
 * This function merges the data (inventory quantity and card objects) from two endpoints into one array.
 */
const cardSearchQuery = async ({ cardName, inStockOnly }: Params) => {
    try {
        const { data } = await axios.get<ScryfallApiCard[]>(
            GET_CARDS_WITH_INFO,
            {
                params: {
                    title: cardName,
                    matchInStock: inStockOnly,
                },
                headers: makeAuthHeader(),
            }
        );

        return data.map((d) => new ScryfallCard(d));
    } catch (err) {
        throw err;
    }
};

export default cardSearchQuery;
