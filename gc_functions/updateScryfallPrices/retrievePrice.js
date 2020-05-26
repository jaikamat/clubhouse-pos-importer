const superagent = require('superagent');

/**
 * Models the data retrieved from Scryfall
 */
class CardInfo {
    constructor({ id, name, set, set_name, prices }) {
        this._id = id;
        this.name = name;
        this.set = set;
        this.set_name = set_name;
        this.prices = new CardPrice(prices)
    }
}

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

        const cardInfo = new CardInfo({ id, name, set, set_name, prices });

        console.log(`${name} | ${set_name} (${set}) | ${JSON.stringify(cardInfo.prices)}`);

        return cardInfo;
    } catch (err) {
        throw err;
    }
}