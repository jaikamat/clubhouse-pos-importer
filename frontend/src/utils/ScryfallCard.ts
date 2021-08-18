import createDisplayName from './createDisplayName';
import getCardImage from './getCardImage';

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

export type QOH = Partial<{
    FOIL_NM: number;
    FOIL_LP: number;
    FOIL_MP: number;
    FOIL_HP: number;
    NONFOIL_NM: number;
    NONFOIL_LP: number;
    NONFOIL_MP: number;
    NONFOIL_HP: number;
}>;

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
    qoh?: QOH;
    quantity?: number;
    qtyToSell?: number;
    finishCondition?: string;
    price?: number;
    promo_types?: string[];
    tcgplayer_id?: number;
}

/**
 * TODO: We should return this from the API. The backend should control this data shape
 *
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
    public tcgplayer_id: number | null;
    public qoh: QOH;

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
        this.cardImage = getCardImage(this);
        this.display_name = createDisplayName(this);
        this.tcgplayer_id = card.tcgplayer_id || null;
        this.qoh = card.qoh ? card.qoh : {};
    }
}
