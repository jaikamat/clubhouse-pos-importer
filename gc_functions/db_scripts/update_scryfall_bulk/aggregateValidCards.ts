import fs from "fs";
import JSONStream from "JSONStream";
import {
    acceptedLangs,
    isArtSeries,
    isBasicLand,
    isOnlyGlossy,
    noGamesOrPaperGames,
} from "./cardValidators";
import validateCustomCards from "./validateCustomCard";

/**
 * Determines what cards will ultimately be committed to the `bulk_cards` collection
 */
function isValidCard(bulkCard: any) {
    // Custom cards should always be aggregated
    if (validateCustomCards(bulkCard)) {
        return true;
    }

    return [
        acceptedLangs(bulkCard),
        noGamesOrPaperGames(bulkCard),
        !isArtSeries(bulkCard),
        !isOnlyGlossy(bulkCard),
        !isBasicLand(bulkCard),
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
