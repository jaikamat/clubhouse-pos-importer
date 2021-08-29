import http from '../common/http';
import { GET_CARDS_WITH_INFO } from '../utils/api_resources';
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
        const { data } = await http.get<ScryfallApiCard[]>(
            GET_CARDS_WITH_INFO,
            {
                params: {
                    title: cardName,
                    matchInStock: inStockOnly,
                },
            }
        );

        return data.map((d) => new ScryfallCard(d));
    } catch (err) {
        throw err;
    }
};

export default cardSearchQuery;
