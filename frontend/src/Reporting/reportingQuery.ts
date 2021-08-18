import Axios from 'axios';
import { Finish } from '../common/types';
import { GET_REPORT } from '../utils/api_resources';
import makeAuthHeader from '../utils/makeAuthHeader';
import { FinishCondition, ScryfallApiCard } from '../utils/ScryfallCard';

export interface ResponseData {
    countByPrinting: Array<{
        _id: string;
        scryfall_id: string;
        count: number;
        card_title: string;
        card_metadata: ScryfallApiCard;
        quantity_on_hand: number;
        finish: Finish;
        finish_condition: FinishCondition;
    }>;
    countByCardName: Array<{
        count: number;
        card_title: string;
    }>;
}

interface Args {
    startDate: string;
    endDate: string;
}

const reportingQuery = async ({ startDate, endDate }: Args) => {
    try {
        const { data } = await Axios.get<ResponseData>(GET_REPORT, {
            params: { startDate, endDate },
            headers: makeAuthHeader(),
        });
        return data;
    } catch (err) {
        throw err;
    }
};

export default reportingQuery;
