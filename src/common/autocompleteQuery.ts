import axios from 'axios';
import { AUTOCOMPLETE } from '../utils/api_resources';

interface Response {
    data: { name: string }[];
}

const autocompleteQuery = async (cardName: string) => {
    try {
        const { data }: Response = await axios.get(AUTOCOMPLETE, {
            params: {
                title: cardName,
            },
        });

        return data;
    } catch (err) {
        throw err;
    }
};

export default autocompleteQuery;
