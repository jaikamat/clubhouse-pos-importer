require('dotenv').config({ path: '../.env' });
const MongoClient = require('mongodb').MongoClient;
const DATABASE = 'test';
const COLLECTION = 'card_inventory';

/**
 * Removes the `legalities` property from card_inventory documents to avoid collisions during $lookups
 */
async function unsetLegalities() {
    const mongoConfig = { useNewUrlParser: true, useUnifiedTopology: true }

    try {
        var client = await new MongoClient(process.env.MONGO_URI, mongoConfig).connect();
        console.log('Connected to Mongo');

        const db = client.db(DATABASE).collection(COLLECTION);

        const numCards = await db.countDocuments();

        console.log(numCards);

        const BATCH_SIZE = 1000;

        for (let i = 0; i < numCards; i += BATCH_SIZE) {
            const docs = await db.find({}).skip(i).limit(BATCH_SIZE).toArray();

            const bulkOps = docs.map(d => {
                return {
                    updateOne: {
                        filter: { _id: d._id },
                        update: {
                            $unset: { prices: '' }
                        }
                    }
                }
            })

            await db.bulkWrite(bulkOps);
            console.log(`${docs.length} documents updated`);
        }

        console.log('All documents updated');
    } catch (err) {
        throw err;
    } finally {
        await client.close();
        console.log('Disconnected from Mongo');
    }
}

unsetLegalities().catch(console.log);