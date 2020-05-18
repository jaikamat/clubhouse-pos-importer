const MongoClient = require('mongodb').MongoClient;

/**
 * Bulkwrites card price data scraped from Scryfall to Mongo
 * @param {Array} priceData - The array of prices scraped
 * @param {String} username
 * @param {String} password
 * @param {String} database - `test` or `production`
 */
module.exports = async function mongoBulkImport(priceData, username, password, database) {
    const BATCH_SIZE = 500; // Bulk import batch size
    const COLLECTION = 'scryfall_pricing_data';
    const dbName = database || 'test'; // Default to test, not prod
    const mongoSettings = { useNewUrlParser: true, useUnifiedTopology: true };

    try {
        const URI = `mongodb+srv://${username}:${password}@cluster0-uytsf.gcp.mongodb.net/test?retryWrites=true&w=majority`;
        var client = await MongoClient.connect(URI, mongoSettings); // 'const' scopes to the block, we need access in 'finally' to close the connection
        const db = await client.db(dbName);

        console.log(`Connected to MongoDB database: ${db.databaseName}`);

        await db.dropCollection(COLLECTION); // Drop the collection to delete old prices
        console.log(`Collection ${COLLECTION} was dropped`);

        await db.createCollection(COLLECTION); // Re-create the collection
        console.log(`Collection ${COLLECTION} was re-created`);

        const bulkWriteOps = priceData.map(d => ({ insertOne: { document: d } }));
        let bulkRound = 1;
        const numRounds = Math.ceil(priceData.length / BATCH_SIZE);

        while (bulkWriteOps.length > 0) {
            const ops = bulkWriteOps.splice(0, BATCH_SIZE);
            await db.collection(COLLECTION).bulkWrite(ops);
            console.log(`Bulkwrite: ${Math.round((bulkRound / numRounds) * 100)}% completed`);
            bulkRound += 1;
        }

        console.log(`Bulkwrite of ${priceData.length} documents completed`);
    } catch (err) {
        throw err;
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}