// Language codes from Scryfall. See https://scryfall.com/docs/api/languages for reference.
const LANG_CODES = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ja: 'Japanese',
    ko: 'Korean',
    ru: 'Russian',
    zhs: 'Simplified Chinese',
    zht: 'Traditional Chinese',
    he: 'Hebrew',
    la: 'Latin',
    grc: 'Ancient Greek',
    ar: 'Arabic',
    sa: 'Sanskrit',
    px: 'Phyrexian'
}

/**
 * This class wraps the Scryfall API request data and models it to something we can control.
 * Also acts as a safeguard for any future updates to Scryfall's API data model and makes
 * the code easier to maintain and debug.
 */
export class ScryfallCard {
    constructor(card) {
        this.id = card.id;
        this.name = card.name;
        this.printed_name = card.printed_name || null;
        this.set = card.set;
        this.set_name = card.set_name;
        this.rarity = card.rarity;
        this.image_uris = card.image_uris || null;
        this.card_faces = card.card_faces || null;
        this.nonfoil = card.nonfoil;
        this.foil = card.foil;
        this.colors = card.colors;
        this.type_line = card.type_line;
        this.frame_effects = card.frame_effects || [];
        this.language = card.lang ? LANG_CODES[card.lang] : '';
    }

    /**
     * Used to display differing border treatments and alt-arts
     */
    get display_name() {
        const { name, printed_name, frame_effects } = this;

        if ((name !== printed_name) && printed_name) {
            return `${name} (IP series)`;
        } else if (frame_effects.includes('showcase')) {
            return `${name} (Showcase)`;
        } else if (frame_effects.includes('extendedart')) {
            return `${name} (Extended art)`;
        } else {
            return name;
        }
    }

    get cardImage() {
        let myImage;

        try {
            // If normal prop doesn't exist, move to catch block for flip card faces
            myImage = this.image_uris.normal;
        } catch (e) {
            myImage = this.card_faces[0].image_uris.normal;
        }

        return myImage;
    }
}

/**
 * Extends the Scryfall card object and adds properties we know exist in our database.
 * Models the data and makes writing cards to Mongo a more confident process.
 */
export class InventoryCard extends ScryfallCard {
    constructor(card) {
        super(card);
        this._qoh = card.qoh ? card.qoh : {};
        // `quantity` and `qtyToSell` are redundant transaction props, unify them down the line
        this.quantity = card.quantity || null;
        this.qtyToSell = card.qtyToSell || null;
        this.finishCondition = card.finishCondition || null;
        this.price = card.price >= 0 ? card.price : null;
    }

    get qohParsed() {
        const foilQty =
            (this._qoh.FOIL_NM || 0) +
            (this._qoh.FOIL_LP || 0) +
            (this._qoh.FOIL_MP || 0) +
            (this._qoh.FOIL_HP || 0);

        const nonfoilQty =
            (this._qoh.NONFOIL_NM || 0) +
            (this._qoh.NONFOIL_LP || 0) +
            (this._qoh.NONFOIL_MP || 0) +
            (this._qoh.NONFOIL_HP || 0);

        return [foilQty, nonfoilQty];
    }

    get qoh() {
        return this._qoh;
    }

    set qoh(quantities) {
        this._qoh = quantities ? quantities : {};
    }
}
