require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

/**
 * Helper fn to create Mongo bulk operations
 * @param {Object} cardInfo - The cardInfo object from retrievePrice
 */
function createBulkOp(cardInfo) {
    const { _id, name, set, set_name, prices } = cardInfo;

    return {
        updateOne: {
            filter: { _id },
            update: {
                $set: { name, set, set_name, prices }
            },
            upsert: true
        }
    }
}

/**
 * Bulkwrites card price data scraped from Scryfall to Mongo
 * @param {Array} priceData - The array of prices scraped
 * @param {String} database - test or production db name
 */
module.exports = async function mongoBulkImport(priceData, database) {
    const BATCH_SIZE = 500; // Bulk import batch size
    const COLLECTION = 'scryfall_pricing_data';
    const dbName = database || 'test'; // Default to test, not prod
    const mongoSettings = { useNewUrlParser: true, useUnifiedTopology: true };

    try {
        const { MONGO_URI } = process.env;
        var client = await MongoClient.connect(MONGO_URI, mongoSettings); // 'const' scopes to the block, we need access in 'finally' to close the connection
        const db = await client.db(dbName);

        console.log(`Connected to MongoDB database: ${db.databaseName}`);

        const bulkWriteOps = priceData.map(d => createBulkOp(d));
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