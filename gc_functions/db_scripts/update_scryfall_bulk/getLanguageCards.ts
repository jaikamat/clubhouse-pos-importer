import fs from "fs";
import JSONStream from "JSONStream";

/**
 * Yields paper-only cards from the source bulk for a single language using JSON streams
 * @param {String} bulkUri - location of the bulk-file to filter on
 * @param {String} language - language code used by Scryfall. See https://scryfall.com/docs/api/languages
 */
function getLanguageCards(bulkUri, language): Promise<any[]> {
    const lang = language || "en";

    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(bulkUri, { encoding: "utf8" });

        const parser = JSONStream.parse("*");

        stream.pipe(parser);

        let cards = [];

        parser.on("data", (card) => {
            if (card.lang === lang) {
                /**
                 * Sometimes early releases do not have an updated "card.games" array.
                 *
                 * We cannot be confident that Scryfall will maintain this with 100% accuracy,
                 * so in the interim, we simply include all cards that do _not_ have any games, as well.
                 *
                 * It's assumed that they are freshly added and will soon be updated to include "paper" as
                 * a game type.
                 */
                if (card.games.length === 0 || card.games.includes("paper")) {
                    cards.push(card);
                }
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

export default getLanguageCards;
