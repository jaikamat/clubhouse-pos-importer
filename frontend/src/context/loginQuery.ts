import axios from 'axios';
import { LOGIN } from '../utils/api_resources';
import makeAuthHeader from '../utils/makeAuthHeader';

type ClubhouseLocation = 'ch1' | 'ch2';

interface ResponseData {
    token: string;
}

const loginQuery = async (
    username: string,
    password: string,
    currentLocation: ClubhouseLocation
) => {
    try {
        const { data } = await axios.post<ResponseData>(
            LOGIN,
            {
                username: username.toLowerCase(),
                password,
                currentLocation,
            },
            { headers: makeAuthHeader() }
        );

        return data;
    } catch (err) {
        throw err;
    }
};

export default loginQuery;
