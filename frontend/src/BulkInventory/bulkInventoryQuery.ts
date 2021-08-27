import axios from 'axios';
import { GET_BULK_CARDS } from '../utils/api_resources';
import makeAuthHeader from '../utils/makeAuthHeader';

export interface BulkCard {
    scryfall_id: string;
    name: string;
    display_name: string;
    set_abbreviation: string;
    set_name: string;
    rarity: string;
    foil_printing: boolean;
    nonfoil_printing: boolean;
    frame: string;
    image: string;
}

const bulkInventoryQuery = async (cardName: string) => {
    try {
        const { data } = await axios.get<BulkCard[]>(GET_BULK_CARDS, {
            params: {
                cardName,
            },
            headers: makeAuthHeader(),
        });

        return data;
    } catch (err) {
        throw err;
    }
};

export default bulkInventoryQuery;
