import Axios from 'axios';
import { GET_REPORT } from '../utils/api_resources';
import makeAuthHeader from '../utils/makeAuthHeader';

export interface ResponseData {
    countByPrinting: Array<{
        count: number;
        card_title: string;
        scryfall_id: string;
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
