import { Db, MongoClient } from 'mongodb';
import { connect, Mongoose } from 'mongoose';
import mongoOptions from './lib/mongoOptions';

let _db: Db;
let _connection: MongoClient;

export const closeConnection = async () => await _connection.close();

/**
 * Connects to mongoDB. Returns a DB instance as a singleton for passing around
 */
const getDatabaseConnection = async (connectionUri?: string) => {
    if (_db) return _db;

    console.log('Attempting to connect to database...');

    const client = new MongoClient(
        connectionUri || process.env.MONGO_URI,
        mongoOptions
    );

    // TODO: trycatch for errors
    _connection = await client.connect();

    _db = await client.db();

    console.log(`Database connection established: ${_db.databaseName}`);

    return _db;
};

/**
 * TODO: We are currently expected to be in the process of a migration
 * to Mongoose ODM. This means that we will need to maintain two connections,
 * then eliminate the above when we can fully remove original node driver code.
 *
 * This is currently used to create a second connection to the DB.
 */
export class Connection {
    static db: Mongoose;

    static async open(connectionUri?: string) {
        if (!this.db) {
            this.db = await connect(connectionUri || process.env.MONGO_URI);
        }

        return this.db;
    }
}

export default getDatabaseConnection;
