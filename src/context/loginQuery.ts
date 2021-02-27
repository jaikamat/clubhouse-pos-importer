import axios from 'axios';
import { LOGIN } from '../utils/api_resources';
import makeAuthHeader from '../utils/makeAuthHeader';

type ClubhouseLocation = 'ch1' | 'ch2';

interface Response {
    data: { token: string };
}

const loginQuery = async (
    username: string,
    password: string,
    currentLocation: ClubhouseLocation
) => {
    const { data }: Response = await axios.post(
        LOGIN,
        {
            username: username.toLowerCase(),
            password,
            currentLocation,
        },
        { headers: makeAuthHeader() }
    );

    return data;
};

export default loginQuery;
