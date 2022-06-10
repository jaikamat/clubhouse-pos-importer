import { connect, Mongoose, connection } from 'mongoose';

class Connection {
    static db: Mongoose;

    static async open(connectionUri?: string) {
        if (!this.db) {
            this.db = await connect(connectionUri || process.env.MONGO_URI);
        }

        return this.db;
    }

    static getConnection() {
        return connection;
    }
}

export default Connection;
