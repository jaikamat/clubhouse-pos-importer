export default interface ScryfallCard {
    object: string;
    id: string;
    oracle_id: string;
    multiverse_ids?: number[] | null;
    mtgo_id: number;
    mtgo_foil_id: number;
    tcgplayer_id: number;
    cardmarket_id: number;
    name: string;
    lang: string;
    released_at: string;
    uri: string;
    scryfall_uri: string;
    layout: string;
    highres_image: boolean;
    image_status: string;
    cmc: number;
    type_line: string;
    color_identity?: string[] | null;
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
    finishes: ('foil' | 'nonfoil' | 'etched' | 'glossy')[];
}

export interface CardFacesEntity {
    object: string;
    name: string;
    mana_cost: string;
    type_line: string;
    oracle_text: string;
    colors?: string[] | null;
    power: string;
    toughness: string;
    artist: string;
    artist_id: string;
    illustration_id: string;
    image_uris: ImageUris;
    color_indicator?: string[] | null;
    flavor_text?: string | null;
}

export interface ImageUris {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
}

export interface Legalities {
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

export interface Prices {
    usd: string;
    usd_foil: string;
    eur: string;
    eur_foil: string;
    tix: string;
}

export interface RelatedUris {
    gatherer: string;
    tcgplayer_infinite_articles: string;
    tcgplayer_infinite_decks: string;
    edhrec: string;
    mtgtop8: string;
}

export interface PurchaseUris {
    tcgplayer: string;
    cardmarket: string;
    cardhoarder: string;
}
