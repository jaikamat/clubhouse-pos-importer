import axios from 'axios';
import { AUTOCOMPLETE } from '../utils/endpoints';

const autocompleteQuery = async (cardName: string) => {
    try {
        const { data } = await axios.get<string[]>(AUTOCOMPLETE, {
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
