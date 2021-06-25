import getDatabaseConnection from '../database';
import { ObjectID } from 'mongodb';
import { Collection } from '../lib/collectionFromLocation';

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

        const user: User = await db.collection(Collection.users).findOne({
            _id: new ObjectID(id),
        });

        return user;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
