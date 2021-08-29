import http from '../common/http';
import { GET_BULK_CARDS } from '../utils/api_resources';

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
        const { data } = await http.get<BulkCard[]>(GET_BULK_CARDS, {
            params: {
                cardName,
            },
        });

        return data;
    } catch (err) {
        throw err;
    }
};

export default bulkInventoryQuery;
