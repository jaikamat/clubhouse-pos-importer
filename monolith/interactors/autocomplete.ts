import mongoose from 'mongoose';
import { Collection } from '../common/types';

async function autocomplete(term: string) {
    try {
        const db = await mongoose.connection.db;
        const collection = db.collection(Collection.scryfallBulkCards);

        // TODO: how to handle aggregation pipelines in mongoose?
        const results: any[] = await collection
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
