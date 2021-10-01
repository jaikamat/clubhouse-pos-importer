import createDisplayName from '../lib/createDisplayName';
import getCardImage from '../lib/getCardImage';
import RawScryfallCard, { CardFacesEntity } from './ScryfallCard';

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

type Color = 'W' | 'U' | 'B' | 'R' | 'G';

type Finishes = ('foil' | 'nonfoil' | 'etched' | 'glossy')[];

export class ScryfallCard {
    public id: string;
    public name: string;
    public printed_name: string | null;
    public set: string;
    public set_name: string;
    public rarity: string;
    public image_uris: { normal: string };
    public card_faces: CardFacesEntity[];
    public finishes: Finishes;
    public colors: Color[];
    public type_line: string;
    public frame_effects: string[];
    public lang: LanguageCode;
    public border_color: string;
    public display_name: string;
    public cardImage: string;
    public color_identity: Color[];
    public promo_types: string[];
    public tcgplayer_id: number | null;
    public keywords: string[];

    public constructor(card: RawScryfallCard) {
        this.id = card.id;
        this.name = card.name;
        this.printed_name = card.printed_name || null;
        this.set = card.set;
        this.set_name = card.set_name;
        this.rarity = card.rarity;
        this.image_uris = card.image_uris || null;
        this.card_faces = card.card_faces || [];
        this.finishes = card.finishes;
        this.colors = (card.colors || []) as Color[];
        this.type_line = card.type_line;
        this.frame_effects = card.frame_effects || [];
        this.lang = card.lang as LanguageCode;
        this.border_color = card.border_color;
        this.color_identity = (card.color_identity || null) as Color[];
        this.promo_types = card.promo_types || [];
        this.keywords = card.keywords || [];
        this.cardImage = getCardImage(this);
        this.display_name = createDisplayName(this);
        this.tcgplayer_id = card.tcgplayer_id || null;
    }
}
