import getDatabaseConnection from '../database';
import { ObjectID } from 'mongodb';

export interface User {
    _id: string;
    password: string;
    username: string;
    locations: string[];
    lightspeedEmployeeNumber: number;
}

export default async function getUserById(id: string): Promise<User> {
    try {
        const db = await getDatabaseConnection();

        const user: User = await db.collection('users').findOne({
            _id: new ObjectID(id),
        });

        return user;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
