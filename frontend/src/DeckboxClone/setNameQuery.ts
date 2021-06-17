import axios from 'axios';
import { GET_SET_NAMES } from '../utils/api_resources';
import makeAuthHeader from '../utils/makeAuthHeader';

interface Response {
    data: string[];
}

const setNameQuery = async () => {
    try {
        const { data }: Response = await axios.get(GET_SET_NAMES, {
            headers: makeAuthHeader(),
        });

        return data;
    } catch (err) {
        throw err;
    }
};

export default setNameQuery;
