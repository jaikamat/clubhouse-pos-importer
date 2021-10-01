import fs from "fs";
import JSONStream from "JSONStream";

export const isAcceptedForeign = (bulkCard: any) => {
    const isJapanese = bulkCard.lang === "ja";
    const isAcceptedSet = bulkCard.set === "war" || bulkCard.set === "sta";

    return isJapanese && isAcceptedSet;
};

export const isAcceptedLang = (bulkCard: any) =>
    ["en", "ph"].includes(bulkCard.lang);

/**
 * Determines what cards will ultimately be committed to the `bulk_cards` collection
 */
function isValidCard(bulkCard: any) {
    const acceptedLangs =
        isAcceptedForeign(bulkCard) || isAcceptedLang(bulkCard);
    /** Tests against art series cards */
    const isArtSeries = bulkCard.layout === "art_series";
    /** We don't support glossy-only cards yet */
    const isOnlyGlossy =
        bulkCard.finishes.includes("glossy") && bulkCard.finishes.length === 1;
    /** Basic lands are not supported */
    const isBasicLand = [
        "Plains",
        "Island",
        "Swamp",
        "Mountain",
        "Forest",
    ].includes(bulkCard.name);
    /**
     * Sometimes early releases do not have an updated "card.games" array.
     *
     * We cannot be confident that Scryfall will maintain this with 100% accuracy,
     * so in the interim, we simply include all cards that do _not_ have any games, as well.
     *
     * It's assumed that they are freshly added and will soon be updated to include "paper" as
     * a game type.
     */
    const noGamesOrPaperGames =
        bulkCard.games.length === 0 || bulkCard.games.includes("paper");

    return [
        acceptedLangs,
        noGamesOrPaperGames,
        !isArtSeries,
        !isOnlyGlossy,
        !isBasicLand,
    ].every((c) => !!c);
}

/**
 * Yields paper-only cards from the source bulk for a single language using JSON streams
 * @param {String} bulkUri - location of the bulk-file to filter on
 * @param {String} language - language code used by Scryfall. See https://scryfall.com/docs/api/languages
 */
function aggregateValidCards(bulkUri: string): Promise<any[]> {
    if (!fs.existsSync(bulkUri)) {
        throw new Error("Bulk source does not exist");
    }

    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(bulkUri, { encoding: "utf8" });

        const parser = JSONStream.parse("*");

        stream.pipe(parser);

        let cards = [];

        parser.on("data", (card) => {
            if (isValidCard(card)) {
                cards.push(card);
            }
        });

        parser.on("end", () => {
            resolve(cards);
        });

        parser.on("error", (err) => {
            reject(err);
        });
    });
}

export default aggregateValidCards;
