import http from '../common/http';
import { GET_SET_NAMES } from '../utils/api_resources';

const setNameQuery = async () => {
    try {
        const { data } = await http.get<string[]>(GET_SET_NAMES);

        return data;
    } catch (err) {
        throw err;
    }
};

export default setNameQuery;
