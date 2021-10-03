import http from '../common/http';
import { GET_REPORT } from '../utils/endpoints';
import {
    Finish,
    FinishCondition,
    RawScryfallCard,
} from '../utils/ScryfallCard';

export interface ResponseData {
    countByPrinting: Array<{
        _id: string;
        scryfall_id: string;
        quantity_sold: number;
        card_title: string;
        card_metadata: RawScryfallCard;
        quantity_on_hand: number;
        finish: Finish;
        finish_condition: FinishCondition;
        estimated_price: number;
    }>;
    countByCardName: Array<{
        _id: string;
        quantity_sold: number;
        card_title: string;
    }>;
}

interface Args {
    startDate: string;
    endDate: string;
}

const reportingQuery = async ({ startDate, endDate }: Args) => {
    try {
        const { data } = await http.get<ResponseData>(GET_REPORT, {
            params: { startDate, endDate },
        });
        return data;
    } catch (err) {
        throw err;
    }
};

export default reportingQuery;
