import { Collection } from '../common/types';
import getDatabaseConnection from '../database';

export interface User {
    _id: string;
    password: string;
    username: string;
    locations: string[];
    lightspeedEmployeeNumber: number;
}

export default async function getUserByName(username: string): Promise<User> {
    try {
        const db = await getDatabaseConnection();

        const user: User = await db.collection(Collection.users).findOne({
            username,
        });

        return user;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
