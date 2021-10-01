import { ScryfallCard } from '../common/ScryfallApiCard';

type Card = Pick<
    ScryfallCard,
    | 'name'
    | 'frame_effects'
    | 'border_color'
    | 'lang'
    | 'finishes'
    | 'promo_types'
>;

/** Computes the proper displayName for a card, depending on its properties */
const createDisplayName = (card: Card) => {
    const { name, frame_effects, border_color, lang, promo_types } = card;

    let displayName: string = name;

    // Covers cards like Godzilla series
    if (promo_types.includes('godzillaseries')) {
        displayName += ` (IP series)`;
        // Covers showcase cards like comic-art Illuna, Apex of Wishes
    } else if (frame_effects.includes('showcase')) {
        displayName += ` (Showcase)`;
        // Covers cards like comic-art Vivien, Monsters' Advocate
    } else if (frame_effects.length === 0 && border_color === 'borderless') {
        displayName += ` (Borderless)`;
        // Covers cards with extended left and roght border art
    } else if (frame_effects.includes('extendedart')) {
        displayName += ` (Extended art)`;
    }

    if (lang !== 'en') displayName += ` (${lang.toUpperCase()})`;

    return displayName;
};

export default createDisplayName;
