const superagent = require('superagent');

/**
 * Helper class for formatting card price
 */
class CardPrice {
    constructor({ usd, usd_foil, eur, tix }) {
        this.usd = Number(usd) || null;
        this.usd_foil = Number(usd_foil) || null;
        this.eur = Number(eur) || null;
        this.tix = Number(tix) || null;
    }
}

/**
 * Makes a request to scryfall for a card's data (with retries)
 * @param {String} cardID
 */
module.exports = async function retrievePrice(cardID) {
    try {
        const { body } = await superagent.get(`https://api.scryfall.com/cards/${cardID}`);
        const { id, name, set, set_name, prices } = body;
        const { usd, usd_foil, eur, tix } = prices;

        const formattedPrice = new CardPrice({ usd, usd_foil, eur, tix });

        console.log(`${name} | ${set_name} (${set}) | ${JSON.stringify(formattedPrice)}`);

        return { _id: id, name, set, set_name, prices: formattedPrice };
    } catch (err) {
        throw err;
    }
}