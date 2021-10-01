/** This matches Scryfall's API */
export interface BulkCard {
    lang: string;
    set: string;
    layout: string;
    finishes: string[];
    name: string;
    games: string[];
}

export type Validator = (card: BulkCard) => boolean;

/** Allowable foreign cards are Japanese, from WAR and STA */
const isAcceptedForeign: Validator = (bulkCard) => {
    const isJapanese = bulkCard.lang === "ja";
    const isAcceptedSet = bulkCard.set === "war" || bulkCard.set === "sta";

    return isJapanese && isAcceptedSet;
};

/** We accept English and Phyrexian */
const isAcceptedLang: Validator = (bulkCard) =>
    ["en", "ph"].includes(bulkCard.lang);

/** We only support Japanese cards from specific sets, in addition to all English cards */
export const acceptedLangs: Validator = (bulkCard) =>
    isAcceptedForeign(bulkCard) || isAcceptedLang(bulkCard);

/** Tests against art series cards */
export const isArtSeries: Validator = (bulkCard) =>
    bulkCard.layout === "art_series";

/** We don't support glossy-only cards yet */
export const isOnlyGlossy: Validator = (bulkCard) =>
    bulkCard.finishes.includes("glossy") && bulkCard.finishes.length === 1;

/** Basic lands are not supported */
export const isBasicLand: Validator = (bulkCard) =>
    ["Plains", "Island", "Swamp", "Mountain", "Forest"].includes(bulkCard.name);

/**
 * Sometimes early releases do not have an updated "card.games" array.
 *
 * We cannot be confident that Scryfall will maintain this with 100% accuracy,
 * so in the interim, we simply include all cards that do _not_ have any games, as well.
 *
 * It's assumed that they are freshly added and will soon be updated to include "paper" as
 * a game type.
 */
export const noGamesOrPaperGames: Validator = (bulkCard) =>
    bulkCard.games.length === 0 || bulkCard.games.includes("paper");
