import axios from 'axios';
import { InventoryCard, ScryfallApiCard } from '../utils/ScryfallCard';
import { GET_CARDS_WITH_INFO_PUBLIC } from '../utils/api_resources';
import { ClubhouseLocation } from '../context/AuthProvider';

interface Params {
    title: string;
    matchInStock: boolean;
    location: ClubhouseLocation;
}

/**
 * Fetches cards from the DB by title when a user selects a title after querying.
 * This function merges the data (inventory quantity and card objects) from two endpoints into one array.
 */
const publicCardSearchQuery = async (params: Params) => {
    try {
        const { data } = await axios.get<ScryfallApiCard[]>(
            GET_CARDS_WITH_INFO_PUBLIC,
            {
                params,
            }
        );

        // Turn the raw API cards into inventory cards
        return data.map((d) => new InventoryCard(d));
    } catch (err) {
        throw err;
    }
};

export default publicCardSearchQuery;
