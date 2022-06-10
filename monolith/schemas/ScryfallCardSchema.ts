import { Schema } from 'mongoose';

// Language codes from Scryfall. See https://scryfall.com/docs/api/languages for reference.
type LanguageCode =
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

type Color = 'W' | 'U' | 'B' | 'R' | 'G';

type Finishes = ('foil' | 'nonfoil' | 'etched' | 'glossy')[];

interface ImageUris {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
}

const ImageUrisSchema = new Schema<ImageUris>({
    small: { type: String },
    normal: { type: String },
    large: { type: String },
    png: { type: String },
    art_crop: { type: String },
    border_crop: { type: String },
});

interface CardFacesEntity {
    object: string;
    name: string;
    mana_cost: string;
    type_line: string;
    oracle_text: string;
    colors?: Color[] | null;
    color_identity?: Color[] | null;
    power: string;
    toughness: string;
    artist: string;
    artist_id: string;
    illustration_id: string;
    image_uris: ImageUris;
    color_indicator?: string[] | null;
    flavor_text?: string | null;
}

const CardFacesEntitySchema = new Schema<CardFacesEntity>({
    object: { type: String, required: true },
    name: { type: String, required: true },
    mana_cost: { type: String, required: true },
    type_line: { type: String, required: true },
    oracle_text: { type: String, required: true },
    colors: { type: [String] },
    color_identity: { type: [String] },
    power: { type: String, required: true },
    toughness: { type: String, required: true },
    artist: { type: String, required: true },
    artist_id: { type: String, required: true },
    illustration_id: { type: String, required: true },
    image_uris: { type: ImageUrisSchema },
    color_indicator: { type: [String] },
    flavor_text: { type: String },
});

interface Legalities {
    standard: string;
    future: string;
    historic: string;
    gladiator: string;
    pioneer: string;
    modern: string;
    legacy: string;
    pauper: string;
    vintage: string;
    penny: string;
    commander: string;
    brawl: string;
    duel: string;
    oldschool: string;
    premodern: string;
}

const LegalitiesSchema = new Schema<Legalities>({
    standard: { type: String, required: true },
    future: { type: String, required: true },
    historic: { type: String, required: true },
    gladiator: { type: String, required: true },
    pioneer: { type: String, required: true },
    modern: { type: String, required: true },
    legacy: { type: String, required: true },
    pauper: { type: String, required: true },
    vintage: { type: String, required: true },
    penny: { type: String, required: true },
    commander: { type: String, required: true },
    brawl: { type: String, required: true },
    duel: { type: String, required: true },
    oldschool: { type: String, required: true },
    premodern: { type: String, required: true },
});

interface Prices {
    usd: string;
    usd_foil: string;
    eur: string;
    eur_foil: string;
    tix: string;
}

const PricesSchema = new Schema({
    usd: { type: String },
    usd_foil: { type: String },
    eur: { type: String },
    eur_foil: { type: String },
    tix: { type: String },
});

interface RelatedUris {
    gatherer: string;
    tcgplayer_infinite_articles: string;
    tcgplayer_infinite_decks: string;
    edhrec: string;
    mtgtop8: string;
}

const RelatedUrisSchema = new Schema<RelatedUris>({
    gatherer: { type: String, required: true },
    tcgplayer_infinite_articles: { type: String, required: true },
    tcgplayer_infinite_decks: { type: String, required: true },
    edhrec: { type: String, required: true },
    mtgtop8: { type: String, required: true },
});

interface PurchaseUris {
    tcgplayer: string;
    cardmarket: string;
    cardhoarder: string;
}

const PurchaseUrisSchema = new Schema<PurchaseUris>({
    tcgplayer: { type: String, required: true },
    cardmarket: { type: String, required: true },
    cardhoarder: { type: String, required: true },
});

export interface ScryfallCard {
    _id: string;
    object: string;
    id: string;
    oracle_id: string;
    multiverse_ids?: number[] | null;
    mtgo_id: number;
    mtgo_foil_id: number;
    tcgplayer_id: number;
    cardmarket_id: number;
    name: string;
    lang: LanguageCode;
    released_at: string;
    uri: string;
    scryfall_uri: string;
    layout: string;
    highres_image: boolean;
    image_status: string;
    cmc: number;
    type_line: string;
    color_identity?: Color[] | null;
    keywords?: string[] | null;
    card_faces?: CardFacesEntity[] | null;
    legalities: Legalities;
    games?: string[] | null;
    reserved: boolean;
    foil: boolean;
    nonfoil: boolean;
    oversized: boolean;
    promo: boolean;
    promo_types: string[];
    reprint: boolean;
    variation: boolean;
    set: string;
    set_name: string;
    set_type: string;
    set_uri: string;
    set_search_uri: string;
    scryfall_set_uri: string;
    rulings_uri: string;
    prints_search_uri: string;
    collector_number: string;
    digital: boolean;
    rarity: string;
    card_back_id: string;
    artist: string;
    artist_ids?: string[] | null;
    border_color: string;
    frame: string;
    frame_effects?: string[] | null;
    full_art: boolean;
    textless: boolean;
    booster: boolean;
    story_spotlight: boolean;
    edhrec_rank: number;
    prices: Prices;
    related_uris: RelatedUris;
    purchase_uris: PurchaseUris;
    image_uris?: ImageUris;
    finishes: Finishes;
    printed_name?: string;
    colors: Color[];
}

const ScryfallCardSchema = new Schema<ScryfallCard>({
    _id: { type: String, required: true },
    object: { type: String, required: true },
    id: { type: String, required: true },
    oracle_id: { type: String, required: true },
    multiverse_ids: { type: [Number] },
    mtgo_id: { type: Number },
    mtgo_foil_id: { type: Number },
    tcgplayer_id: { type: Number },
    cardmarket_id: { type: Number },
    name: { type: String, required: true },
    lang: { type: String },
    released_at: { type: String, required: true },
    uri: { type: String, required: true },
    scryfall_uri: { type: String, required: true },
    layout: { type: String, required: true },
    highres_image: { type: Boolean },
    image_status: { type: String, required: true },
    cmc: { type: Number },
    type_line: { type: String, required: true },
    color_identity: { type: [String] },
    keywords: { type: [String] },
    card_faces: { type: [CardFacesEntitySchema] },
    legalities: { type: LegalitiesSchema },
    games: { type: [String] },
    reserved: { type: Boolean, required: true },
    foil: { type: Boolean, required: true },
    nonfoil: { type: Boolean, required: true },
    oversized: { type: Boolean, required: true },
    promo: { type: Boolean, required: true },
    promo_types: { type: [String], required: true },
    reprint: { type: Boolean, required: true },
    variation: { type: Boolean, required: true },
    set: { type: String, required: true },
    set_name: { type: String, required: true },
    set_type: { type: String, required: true },
    set_uri: { type: String, required: true },
    set_search_uri: { type: String, required: true },
    scryfall_set_uri: { type: String, required: true },
    rulings_uri: { type: String, required: true },
    prints_search_uri: { type: String, required: true },
    collector_number: { type: String, required: true },
    digital: { type: Boolean, required: true },
    rarity: { type: String, required: true },
    card_back_id: { type: String, required: true },
    artist: { type: String, required: true },
    artist_ids: { type: [String] },
    border_color: { type: String, required: true },
    frame: { type: String, required: true },
    frame_effects: { type: [String] },
    full_art: { type: Boolean, required: true },
    textless: { type: Boolean, required: true },
    booster: { type: Boolean, required: true },
    story_spotlight: { type: Boolean, required: true },
    edhrec_rank: { type: Number, required: true },
    prices: { type: PricesSchema },
    related_uris: { type: RelatedUrisSchema },
    purchase_uris: { type: PurchaseUrisSchema },
    image_uris: { type: ImageUrisSchema },
    finishes: { type: [String], required: true },
    printed_name: { type: String },
    colors: { type: [String], required: true },
});

export default ScryfallCardSchema;
