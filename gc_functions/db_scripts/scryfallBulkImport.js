const fs = require('fs');
const https = require('https');
const execSync = require('child_process').execSync;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config({ path: '../.env' });

/**
 * Promisifies a node request. Used to fetch JSON (Scryfall's bulk data)
 *
 * @param {string} url - The https endpoint to request
 */
const promisifyRequest = url => {
    return new Promise((resolve, reject) => {
        let body = '';

        return https.get(url, res => {
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(body));
            res.on('error', () => reject(`There was an error requesting ${url}`));
        });
    });
};

/**
 * Creates a new index on `id` in the collection, to improve lookup speeds in the `getCardsByFilter` endpoint
 *
 * @param {string} dbName - The name of the database (test or production)
 * @param {string} collection - The name of the collection within the database
 */
const createIndex = async (dbName, collection) => {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        const db = client.db(dbName).collection(collection);
        await db.createIndex({ id: 1 });
    } catch (err) {
        throw err;
    } finally {
        await client.close();
    }
}

const init = async dbName => {
    const COLLECTION = 'scryfall_bulk_cards';
    const SCRYFALL_BULK_URL = `https://archive.scryfall.com/json/scryfall-default-cards.json`;
    const JSON_FILE_PATH = `/Users/admin/Documents/dev_projects/clubhouse-pos-importer/gc_functions/db_scripts/scryfall_bulk.json`;
    const { DB_HOST, DB_USERNAME, DB_PASS } = process.env;

    try {
        if (!['test', 'clubhouse_collection_production'].includes(dbName)) {
            throw new Error('Correct database type was not specified');
        }

        console.log('Making request to Scryfall for JSON...');

        const res = await promisifyRequest(SCRYFALL_BULK_URL);

        console.log('Writing bulk JSON to file...');

        fs.writeFileSync('./scryfall_bulk.json', res);

        console.log(`File written, executing mongoImport...`);

        const command = `mongoimport --host ${DB_HOST} --ssl --username ${DB_USERNAME} --password ${DB_PASS} --authenticationDatabase admin --db ${dbName} --collection ${COLLECTION} --type json --jsonArray --drop --file ${JSON_FILE_PATH}`;

        execSync(command, { stdio: 'inherit' }); // stdio inherits the child process terminal output to visualize it

        console.log('Bulk cards imported, creating indexes...');

        await createIndex(dbName, COLLECTION);

        console.log('Database import completed')
    } catch (err) {
        throw err;
    }
}

(async () => {
    try {
        const args = [...process.argv];

        if (args.length > 3) throw new Error('Too many arguments provided');
        if (args.length <= 2) throw new Error('Use --test or --prod as arguments');

        const environmentType = args[2].split('--')[1];

        if (environmentType === 'test') {
            await init('test');
        } else if (environmentType === 'prod') {
            await init('clubhouse_collection_production');
        } else {
            throw new Error(`Script argument was not one of ['--test', '--prod']`)
        }
    } catch (err) {
        throw err;
    }
})();