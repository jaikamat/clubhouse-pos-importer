require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

/**
 * Helper class for formatting card price
 */
class CardPrice {
    constructor({ usd = null, usd_foil = null, eur = null, tix = null }) {
        this.usd = Number(usd) || null;
        this.usd_foil = Number(usd_foil) || null;
        this.eur = Number(eur) || null;
        this.tix = Number(tix) || null;
    }
}

/**
 * Helper fn to create Mongo bulk operations. Re-sets all card properties.
 * @param {Object} scryfallCard - The card from Scryfall
 */
function createBulkOp(scryfallCard) {
    const { id, prices } = scryfallCard;

    return {
        updateOne: {
            filter: { _id: id }, // upsert the inserted cards to have a String _id rather than ObjectId
            update: {
                $set: { ...scryfallCard, prices: new CardPrice(prices) }
            },
            upsert: true
        }
    }
}

/**
 * Bulkwrites card price data scraped from Scryfall to Mongo
 * @param {Array} cards - Array of cards from Scryfall
 * @param {String} database - test or production db name
 */
module.exports = async function mongoBulkImport(cards, database) {
    const BATCH_SIZE = 500; // Bulk import batch size
    const COLLECTION = 'scryfall_bulk_cards';
    const dbName = database || 'test'; // Default to test, not prod
    const mongoSettings = { useNewUrlParser: true, useUnifiedTopology: true };

    try {
        const { MONGO_URI } = process.env;
        var client = await MongoClient.connect(MONGO_URI, mongoSettings); // 'const' scopes to the block, we need access in 'finally' to close the connection
        const db = await client.db(dbName);

        console.log(`Connected to MongoDB database: ${db.databaseName}`);

        const bulkWriteOps = cards.map(d => createBulkOp(d));
        let bulkRound = 1;
        const numRounds = Math.ceil(cards.length / BATCH_SIZE);

        while (bulkWriteOps.length > 0) {
            const ops = bulkWriteOps.splice(0, BATCH_SIZE);
            await db.collection(COLLECTION).bulkWrite(ops);
            console.log(`Bulkwrite: ${Math.round((bulkRound / numRounds) * 100)}% completed`);
            bulkRound += 1;
        }

        console.log(`Bulkwrite of ${cards.length} documents completed`);
    } catch (err) {
        throw err;
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}