import mongoose from 'mongoose';
import { Collection } from '../common/types';

export interface User {
    _id: string;
    password: string;
    username: string;
    locations: string[];
    lightspeedEmployeeNumber: number;
}

export default async function getUserById(id: string): Promise<User> {
    try {
        const db = await mongoose.connection.db;

        // TODO: remove any and replace with mongoose schema queries
        const user: any = await db.collection(Collection.users).findOne({
            _id: new mongoose.Types.ObjectId(id),
        });

        return user;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
