import http from '../common/http';
import { ClientCard } from '../utils/ClientCard';
import { GET_CARDS_WITH_INFO } from '../utils/endpoints';

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
        const { data } = await http.get<ClientCard[]>(GET_CARDS_WITH_INFO, {
            params: {
                title: cardName,
                matchInStock: inStockOnly,
            },
        });

        return data;
    } catch (err) {
        throw err;
    }
};

export default cardSearchQuery;
