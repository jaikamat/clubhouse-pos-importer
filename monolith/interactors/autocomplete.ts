import getDatabaseConnection from '../database';
import { Collection } from '../lib/collectionFromLocation';

async function autocomplete(term: string) {
    try {
        const db = await getDatabaseConnection();
        const collection = db.collection(Collection.scryfallBulkCards);

        const results: { name: string }[] = await collection
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
    }
}

export default autocomplete;
