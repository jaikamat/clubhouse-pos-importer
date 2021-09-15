import { Db, MongoClient } from 'mongodb';
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

export default getDatabaseConnection;
