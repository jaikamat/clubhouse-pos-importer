import ScryfallCardModel from '../models/ScryfallCardModel';
import { ScryfallCard } from '../schemas/ScryfallCardSchema';

/**
 * Finds a bulk card by its associated `_id`
 */
async function findBulkById(id: string): Promise<ScryfallCard> {
    try {
        return await ScryfallCardModel.findOne({ _id: id });
    } catch (err) {
        throw err;
    }
}

export default findBulkById;
