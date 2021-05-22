import createDisplayName from './createDisplayName';

// Language codes from Scryfall. See https://scryfall.com/docs/api/languages for reference.
export type LanguageCode =
    | 'en'
    | 'es'
    | 'fr'
    | 'de'
    | 'it'
    | 'pt'
    | 'ja'
    | 'ko'
    | 'ru'
    | 'zhs'
    | 'zht'
    | 'he'
    | 'la'
    | 'grc'
    | 'ar'
    | 'sa'
    | 'px';

export type FinishCondition =
    | 'FOIL_NM'
    | 'FOIL_LP'
    | 'FOIL_MP'
    | 'FOIL_HP'
    | 'NONFOIL_NM'
    | 'NONFOIL_LP'
    | 'NONFOIL_MP'
    | 'NONFOIL_HP';

export interface QOH {
    FOIL_NM: number;
    FOIL_LP: number;
    FOIL_MP: number;
    FOIL_HP: number;
    NONFOIL_NM: number;
    NONFOIL_LP: number;
    NONFOIL_MP: number;
    NONFOIL_HP: number;
}

export interface ImageURIs {
    normal: string;
}

export interface CardFace {
    colors: string[];
    type_line: string;
    color_identity: string[];
    image_uris: ImageURIs;
}

export interface ScryfallApiCard {
    id: string;
    name: string;
    printed_name: string;
    set: string;
    set_name: string;
    rarity: string;
    image_uris: ImageURIs;
    card_faces: CardFace[];
    nonfoil: boolean;
    foil: boolean;
    colors: string[];
    type_line: string;
    frame_effects: string[];
    lang: LanguageCode;
    border_color: string;
    display_name: string;
    cardImage: string;
    color_identity: string[];
    qoh?: Partial<QOH>;
    quantity?: number;
    qtyToSell?: number;
    finishCondition?: string;
    price?: number;
    promo_types?: string[];
}

/**
 * This class wraps the Scryfall API request data and models it to something we can control.
 * Also acts as a safeguard for any future updates to Scryfall's API data model and makes
 * the code easier to maintain and debug.
 */
export class ScryfallCard {
    public id: string;
    public name: string;
    public printed_name: string | null;
    public set: string;
    public set_name: string;
    public rarity: string;
    public image_uris: { normal: string };
    public card_faces: CardFace[];
    public nonfoil: boolean;
    public foil: boolean;
    public colors: string[];
    public type_line: string;
    public frame_effects: string[];
    public lang: LanguageCode;
    public border_color: string;
    public display_name: string;
    public cardImage: string;
    public color_identity: string[];
    public promo_types: string[];

    public constructor(card: ScryfallApiCard) {
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
        this.lang = card.lang;
        this.border_color = card.border_color;
        this.color_identity = card.color_identity || null;
        this.promo_types = card.promo_types || [];
        this.cardImage = this._getCardImage();
        this.display_name = this._createDisplayName();
    }

    // Computes the proper displayName for a card, depending on its properties
    _createDisplayName() {
        return createDisplayName(this);
    }

    _getCardImage() {
        let myImage: string;

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
    private _qoh: Partial<QOH>;
    public quantity: number | null;
    public qtyToSell: number | null;
    public finishCondition: string | null;
    public price: number | null;

    public constructor(card: ScryfallApiCard) {
        super(card);
        this._qoh = card.qoh ? card.qoh : {};
        // `quantity` and `qtyToSell` are redundant transaction props, unify them down the line
        // TODO: remove quantity as it seems to be unused
        // TODO: Never mind, it's used in Receiving briefly
        this.quantity = card.quantity || null;
        this.qtyToSell = card.qtyToSell || null;
        this.finishCondition = card.finishCondition || null;
        this.price = card.price && card.price >= 0 ? card.price : null;
    }

    get qoh() {
        return this._qoh;
    }

    set qoh(quantities) {
        this._qoh = quantities ? quantities : {};
    }
}
