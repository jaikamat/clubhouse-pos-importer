import mongoose from 'mongoose';
import RawScryfallCard from '../common/RawScryfallCard';
import { Collection } from '../common/types';

/**
 * Finds a bulk card by its associated `_id`
 */
async function findBulkById(id: string): Promise<RawScryfallCard> {
    try {
        // TODO: remove any and replace with mongoose schema queries
        const card: any = await mongoose.connection.db
            .collection(Collection.scryfallBulkCards)
            .findOne({ _id: id });

        return card;
    } catch (err) {
        throw err;
    }
}

export default findBulkById;
