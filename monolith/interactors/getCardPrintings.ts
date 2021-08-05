import { Collection } from '../common/types';
import getDatabaseConnection from '../database';
import ScryfallCard from './ScryfallCard';

// etched: boolean
// found in frame effects
// borderless: boolean
// found in border_color
// showcase: boolean
// found in frame effects
class BulkCard {
    public scryfall_id: string;
    public name: string;
    public set_abbreviation: string;
    public set_name: string;
    public rarity: string;
    public frame_effects: string[] | null;
    public foil: boolean;
    public nonfoil: boolean;
    public border_color: string;

    constructor(card: ScryfallCard) {
        this.scryfall_id = card.id;
        this.name = card.name;
        this.set_abbreviation = card.set;
        this.set_name = card.set_name;
        this.rarity = card.rarity;
        this.frame_effects = card.frame_effects;
        this.foil = card.foil;
        this.nonfoil = card.nonfoil;
        this.border_color = card.border_color;
    }
}

async function getCardPrintings(cardName: string) {
    try {
        const db = await getDatabaseConnection();

        const pipeline = [];

        // Text match on card title
        const search = {
            index: 'autocomplete',
            autocomplete: {
                query: cardName,
                path: 'name',
                tokenOrder: 'sequential',
            },
        };

        pipeline.push({ $search: search });

        const cards = await db
            .collection(Collection.scryfallBulkCards)
            .aggregate(pipeline)
            .toArray();

        return cards.map((c) => new BulkCard(c));
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default getCardPrintings;
