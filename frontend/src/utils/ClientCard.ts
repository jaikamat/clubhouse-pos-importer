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

export type Finish = 'FOIL' | 'NONFOIL' | 'ETCHED';

export type Condition = 'NM' | 'LP' | 'MP' | 'HP';

export type FinishCondition = `${Finish}_${Condition}`;

export type QOH = Partial<Record<FinishCondition, number>>;

export type Color = 'W' | 'U' | 'B' | 'R' | 'G';

export interface ImageURIs {
    normal: string;
}

export interface CardFace {
    colors: Color[];
    type_line: string;
    color_identity: Color[];
    image_uris: ImageURIs;
}

export type Finishes = ('foil' | 'nonfoil' | 'etched' | 'glossy')[];

export interface ClientCard {
    id: string;
    name: string;
    printed_name: string | null;
    set: string;
    set_name: string;
    rarity: string;
    image_uris: { normal: string };
    card_faces: CardFace[];
    finishes: Finishes;
    colors: Color[];
    type_line: string;
    frame_effects: string[];
    lang: LanguageCode;
    border_color: string;
    display_name: string;
    cardImage: string;
    color_identity: Color[];
    promo_types: string[];
    tcgplayer_id: number | null;
    keywords: string[];
    qoh: QOH;
}
