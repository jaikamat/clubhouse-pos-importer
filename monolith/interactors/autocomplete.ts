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

        const results: { name: string }[] = await db
            .collection('scryfall_bulk_cards')
            .aggregate([
                {
                    $search: {
                        index: 'autocomplete',
                        autocomplete: {
                            query: term,
                            path: 'name',
                            tokenOrder: 'sequential',
                            fuzzy: {
                                maxEdits: 1,
                                maxExpansions: 50,
                                prefixLength: 3,
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        name: 1,
                    },
                },
            ])
            .toArray();

        return results
            .map((r) => r.name)
            .sort((a, b) => a.length - b.length)
            .slice(0, 10)
            .filter((el, idx, arr) => {
                return arr.indexOf(el) === idx;
            });
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}

export default autocomplete;
