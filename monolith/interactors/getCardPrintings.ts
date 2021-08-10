import { Collection } from '../common/types';
import getDatabaseConnection from '../database';
import ScryfallCard from './ScryfallCard';
import cardImageUrl from '../lib/cardImageUrl';
import cardDisplayName from '../lib/cardDisplayName';

class BulkCard {
    public scryfall_id: string;
    public name: string;
    public display_name: string;
    public set_abbreviation: string;
    public set_name: string;
    public rarity: string;
    public foil_printing: boolean;
    public nonfoil_printing: boolean;
    public frame: string;
    public image: string;

    constructor(card: ScryfallCard) {
        this.scryfall_id = card.id;
        this.name = card.name;
        this.display_name = cardDisplayName(card);
        this.set_abbreviation = card.set;
        this.set_name = card.set_name;
        this.rarity = card.rarity;
        this.foil_printing = card.foil;
        this.nonfoil_printing = card.nonfoil;
        this.frame = card.frame;
        this.image = cardImageUrl(card);
    }
}

/**
 * We clamp a max number of return objects to prevent results with hundreds
 * of results (such as basic lands) to slow rendering in the client
 */
const MAX_RESULTS = 50;

async function getCardPrintings(cardName: string) {
    try {
        const db = await getDatabaseConnection();

        const pipeline = [];

        // Match only english cards
        const match = {
            lang: 'en',
        };

        // Text match on card title
        const search = {
            index: 'autocomplete',
            autocomplete: {
                query: cardName,
                path: 'name',
                tokenOrder: 'sequential',
                fuzzy: {
                    maxEdits: 1,
                    maxExpansions: 50,
                    prefixLength: 3,
                },
            },
        };

        pipeline.push({ $search: search });
        pipeline.push({ $match: match });

        const cards = await db
            .collection(Collection.scryfallBulkCards)
            .aggregate(pipeline)
            .toArray();

        const bulk = cards.map((c) => new BulkCard(c));

        return (
            bulk
                // Sort names to order the shortest matches first
                .sort((a, b) => a.name.length - b.name.length)
                .slice(0, MAX_RESULTS)
        );
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default getCardPrintings;
