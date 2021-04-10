import mongoOptions from './lib/mongoOptions';
import { Db, MongoClient } from 'mongodb';
import getDatabaseName from './lib/getDatabaseName';
const DATABASE_NAME = getDatabaseName();

let _db: Db;
let _connection: MongoClient;

export const closeConnection = async () => await _connection.close();

/**
 * Connects to mongoDB. Returns a DB instance as a singleton for passing around
 */
const getDatabaseConnection = async () => {
    if (_db) return _db;

    console.log('Attempting to connect to database...');

    const client = new MongoClient(process.env.MONGO_URI, mongoOptions);

    // TODO: trycatch for errors
    _connection = await client.connect();

    _db = await client.db(DATABASE_NAME);

    console.log(`Database connection established: ${DATABASE_NAME}`);

    return _db;
};

export default getDatabaseConnection;
