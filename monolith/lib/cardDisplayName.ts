import RawScryfallCard from '../common/RawScryfallCard';

/**
 * Creates a detailed user-friendly name for cards to discern what they are, without imagery
 */
function cardDisplayName(card: RawScryfallCard): string {
    const treatments: string[] = [];
    const baseTitle = card.name;
    const setName = card.set_name;

    const isPrereleasePromo =
        card.promo_types && card.promo_types.includes('prerelease');

    const isPromoPackPromo =
        card.promo_types && card.promo_types.includes('promopack');

    const isStampedPromo =
        card.promo_types && card.promo_types.includes('stamped');

    const isShowcase =
        card.frame_effects && card.frame_effects.includes('showcase');

    const isBorderless = card.border_color === 'borderless';

    const isEtched =
        card.frame_effects && card.frame_effects.includes('etched');

    const isExtendedArt =
        card.frame_effects && card.frame_effects.includes('extendedart');

    const isRetroBorder = card.frame && card.frame.includes('1997');

    if (isPrereleasePromo) treatments.push('Prerelease promo');
    if (isPromoPackPromo) treatments.push('Promo pack');
    if (isStampedPromo) treatments.push('Stamped');
    if (isShowcase) treatments.push('Showcase');
    if (isBorderless) treatments.push('Borderless');
    if (isEtched) treatments.push('Etched');
    if (isExtendedArt) treatments.push('Extended art');
    if (isRetroBorder) treatments.push('Retro frame');

    const separator = treatments.length > 0 ? ' - ' : '';

    return `${baseTitle} - ${setName}${separator}${treatments.join(', ')}`;
}

export default cardDisplayName;
