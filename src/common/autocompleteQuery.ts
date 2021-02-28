import axios from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';
import { SCRYFALL_AUTOCOMPLETE } from '../utils/api_resources';

interface Response {
    data: {
        data: string[];
        object: string;
        total_values: 1;
    };
}

const autocompleteQuery = async (cardName: string) => {
    try {
        const { data }: Response = await axios.get(
            `${SCRYFALL_AUTOCOMPLETE}?q=${cardName}`,
            {
                headers: makeAuthHeader(),
            }
        );

        return data;
    } catch (err) {
        throw err;
    }
};

export default autocompleteQuery;
