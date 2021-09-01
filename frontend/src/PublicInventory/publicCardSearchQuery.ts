import axios from 'axios';
import { ClubhouseLocation } from '../context/AuthProvider';
import { GET_CARDS_WITH_INFO_PUBLIC } from '../utils/endpoints';
import { ScryfallApiCard, ScryfallCard } from '../utils/ScryfallCard';

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

        return data.map((d) => new ScryfallCard(d));
    } catch (err) {
        throw err;
    }
};

export default publicCardSearchQuery;
