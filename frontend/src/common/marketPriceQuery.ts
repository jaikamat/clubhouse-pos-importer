import Axios from 'axios';
import { GET_LIVE_PRICE } from '../utils/api_resources';

interface Response {
    data: {
        marketPrices: { foil: number; normal: number };
        medianPrices: { foil: number; normal: number };
    };
}

interface Payload {
    scryfallId: string;
}

const marketPriceQuery = async ({ scryfallId }: Payload) => {
    try {
        const { data }: Response = await Axios.get(GET_LIVE_PRICE, {
            params: { scryfallId },
        });

        const { marketPrices, medianPrices } = data;

        return {
            marketPrices,
            medianPrices,
        };
    } catch (err) {
        throw err;
    }
};

export default marketPriceQuery;
