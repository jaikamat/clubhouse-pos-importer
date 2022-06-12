import cardDisplayName from '../lib/cardDisplayName';
import cardImageUrl from '../lib/cardImageUrl';
import ScryfallCardModel from '../models/ScryfallCardModel';
import { ScryfallCard } from '../schemas/ScryfallCardSchema';

class BulkCard {
    public scryfall_id: string;
    public name: string;
    public display_name: string;
    public set_abbreviation: string;
    public set_name: string;
    public rarity: string;
    public finishes: string[];
    public frame: string;
    public image: string;

    constructor(card: ScryfallCard) {
        this.scryfall_id = card.id;
        this.name = card.name;
        this.display_name = cardDisplayName(card);
        this.set_abbreviation = card.set;
        this.set_name = card.set_name;
        this.rarity = card.rarity;
        this.finishes = card.finishes;
        this.frame = card.frame;
        this.image = cardImageUrl(card);
    }
}

/**
 * We clamp a max number of return objects to prevent results with hundreds
 * of results (such as basic lands) to slow rendering in the client
 */
const MAX_RESULTS = 50;

async function getCardPrintings(cardName: string): Promise<BulkCard[]> {
    try {
        const results = await ScryfallCardModel.aggregate<ScryfallCard>()
            // Text match on card title
            .search({
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
            })
            // Match only english cards
            .match({ lang: 'en' });

        // TODO: remove and replace with mongoose model static methods?
        const bulk = results.map((c) => new BulkCard(c));

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
