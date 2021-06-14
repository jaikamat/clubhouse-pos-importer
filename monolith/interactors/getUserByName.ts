import { ClubhouseLocation } from './getJwt';
import getDatabaseConnection from '../database';

type User = {
    _id: string;
    password: string;
    username: string;
    locations: string[];
    currentLocation: ClubhouseLocation;
    lightspeedEmployeeNumber: number;
};

export default async function getUserByName(username: string): Promise<User> {
    try {
        const db = await getDatabaseConnection();

        const user: User = await db.collection('users').findOne({
            username,
        });

        return user;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
