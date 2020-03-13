
/**
 * This class wraps the Scryfall API request data and models it to something we can control.
 * Also acts as a safeguard for any future updates to Scryfall's API data model and makes
 * the code easier to maintain and debug.
 */
export class ScryfallCard {
    constructor(card) {
        this.cachedOriginal = card;
        this.id = card.id;
        this.name = card.name;
        this.set = card.set;
        this.set_name = card.set_name;
        this.rarity = card.rarity;
        this.image_uris = card.image_uris ? card.image_uris : null;
        this.card_faces = card.card_faces ? card.card_faces : null;
        this.nonfoil = card.nonfoil;
        this.foil = card.foil;
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
