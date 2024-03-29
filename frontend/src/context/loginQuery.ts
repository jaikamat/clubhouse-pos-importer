import http from '../common/http';
import { LOGIN } from '../utils/endpoints';

type ClubhouseLocation = 'ch1' | 'ch2';

interface ResponseData {
    token: string;
    admin: boolean;
}

const loginQuery = async (
    username: string,
    password: string,
    currentLocation: ClubhouseLocation
) => {
    try {
        const { data } = await http.post<ResponseData>(LOGIN, {
            username: username.toLowerCase(),
            password,
            currentLocation,
        });

        return data;
    } catch (err) {
        throw err;
    }
};

export default loginQuery;
