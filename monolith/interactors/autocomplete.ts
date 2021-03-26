const MongoClient = require('mongodb').MongoClient;
import getDatabaseName from '../lib/getDatabaseName';
const DATABASE_NAME = getDatabaseName();

async function autocomplete(term: string) {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();

        const db = client.db(DATABASE_NAME);

        return await db
            .collection('scryfall_bulk_cards')
            .aggregate([
                {
                    $search: {
                        text: {
                            query: term,
                            path: 'name',
                            fuzzy: {
                                maxEdits: 1,
                                maxExpansions: 50,
                                prefixLength: 2,
                            },
                        },
                    },
                },
                {
                    $limit: 10,
                },
                {
                    $project: {
                        _id: 0,
                        name: 1,
                    },
                },
            ])
            .toArray();
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}

export default autocomplete;
