import axios from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';
import { InventoryCard, ScryfallApiCard } from '../utils/ScryfallCard';
import { GET_CARDS_WITH_INFO } from '../utils/api_resources';

interface Response {
    data: ScryfallApiCard[];
}

interface Payload {
    cardName: string;
    inStockOnly: boolean;
}

/**
 * Fetches cards from the DB by title when a user selects a title after querying.
 * This function merges the data (inventory quantity and card objects) from two endpoints into one array.
 */
const cardSearchQuery = async (payload: Payload) => {
    try {
        const { cardName, inStockOnly } = payload;

        const { data }: Response = await axios.get(GET_CARDS_WITH_INFO, {
            params: {
                title: cardName,
                matchInStock: inStockOnly,
            },
            headers: makeAuthHeader(),
        });

        // Turn the raw API cards into inventory cards
        // TODO: Re-evaluate whether this is needed
        return data.map((d) => new InventoryCard(d));
    } catch (err) {
        throw err;
    }
};

export default cardSearchQuery;
