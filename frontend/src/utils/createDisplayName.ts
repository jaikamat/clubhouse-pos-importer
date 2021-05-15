import { ScryfallCard } from './ScryfallCard';

/** Computes the proper displayName for a card, depending on its properties */
const createDisplayName = (card: ScryfallCard) => {
    const {
        name,
        printed_name,
        frame_effects,
        border_color,
        lang,
        set,
        foil,
        nonfoil,
    } = card;

    if (lang !== 'en') return `${name} (${lang.toUpperCase()})`;

    // Covers strixhaven etched foil mystical archive cards
    if (set === 'sta' && foil === true && nonfoil === false) {
        return `${name} (Etched foil)`;
    } else if (name !== printed_name && printed_name) {
        // Covers cards like Godzilla series
        return `${name} (IP series)`;
    } else if (frame_effects.length === 0 && border_color === 'borderless') {
        // Covers cards like comic-art Vivien, Monsters' Advocate
        return `${name} (Borderless)`;
    } else if (frame_effects.includes('showcase')) {
        // Covers showcase cards like comic-art Illuna, Apex of Wishes
        return `${name} (Showcase)`;
    } else if (frame_effects.includes('extendedart')) {
        // Covers cards with extended left and roght border art
        return `${name} (Extended art)`;
    } else {
        return name;
    }
};

export default createDisplayName;
