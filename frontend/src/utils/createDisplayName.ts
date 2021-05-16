import { ScryfallCard } from './ScryfallCard';

type Card = Pick<
    ScryfallCard,
    | 'name'
    | 'frame_effects'
    | 'border_color'
    | 'lang'
    | 'set'
    | 'foil'
    | 'nonfoil'
    | 'promo_types'
>;

/** Computes the proper displayName for a card, depending on its properties */
const createDisplayName = (card: Card) => {
    const {
        name,
        frame_effects,
        border_color,
        lang,
        set,
        foil,
        nonfoil,
        promo_types,
    } = card;

    let displayName: string = name;

    // Covers strixhaven etched foil mystical archive cards
    if (set === 'sta' && foil === true && nonfoil === false) {
        displayName += ` (Etched foil)`;
    } else if (promo_types.includes('godzillaseries')) {
        // Covers cards like Godzilla series
        displayName += ` (IP series)`;
    } else if (frame_effects.includes('showcase')) {
        // Covers showcase cards like comic-art Illuna, Apex of Wishes
        displayName += ` (Showcase)`;
    } else if (frame_effects.length === 0 && border_color === 'borderless') {
        // Covers cards like comic-art Vivien, Monsters' Advocate
        displayName += ` (Borderless)`;
    } else if (frame_effects.includes('extendedart')) {
        // Covers cards with extended left and roght border art
        displayName += ` (Extended art)`;
    }

    if (lang !== 'en') displayName += ` (${lang.toUpperCase()})`;

    return displayName;
};

export default createDisplayName;
