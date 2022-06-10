import { model } from 'mongoose';
import ScryfallCardSchema, {
    ScryfallCard,
} from '../schemas/ScryfallCardSchema';

const ScryfallCardModel = model<ScryfallCard>(
    'ScryfallCard',
    ScryfallCardSchema,
    'scryfall_bulk_cards'
);

export default ScryfallCardModel;
