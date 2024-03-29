import http from '../common/http';
import { Finishes } from '../utils/ClientCard';
import { GET_BULK_CARDS } from '../utils/endpoints';

export interface BulkCard {
    scryfall_id: string;
    name: string;
    display_name: string;
    set_abbreviation: string;
    set_name: string;
    rarity: string;
    finishes: Finishes;
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
