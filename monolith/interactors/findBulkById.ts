import RawScryfallCard from '../common/RawScryfallCard';
import { Collection } from '../common/types';
import getDatabaseConnection from '../database';

/**
 * Finds a bulk card by its associated `_id`
 */
async function findBulkById(id: string): Promise<RawScryfallCard> {
    try {
        const db = await getDatabaseConnection();

        const card: RawScryfallCard = await db
            .collection(Collection.scryfallBulkCards)
            .findOne({ _id: id });

        return card;
    } catch (err) {
        throw err;
    }
}

export default findBulkById;
