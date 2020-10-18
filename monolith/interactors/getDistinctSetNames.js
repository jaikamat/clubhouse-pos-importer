const MongoClient = require('mongodb').MongoClient;
const fetchDbName = require('../lib/fetchDbName');
const DATABASE_NAME = fetchDbName();

/**
 * Gets a list of all set names, for use in the Deckbox frontend dropdown selection
 */
async function getDistinctSetNames() {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();

        const db = client.db(DATABASE_NAME);

        return await db.collection('card_inventory').distinct('set_name');
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}

module.exports = getDistinctSetNames;
