/**
 * Models the data retrieved from Scryfall
 */
module.exports = class CardInfo {
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
    constructor({ usd = null, usd_foil = null, eur = null, tix = null }) {
        this.usd = Number(usd) || null;
        this.usd_foil = Number(usd_foil) || null;
        this.eur = Number(eur) || null;
        this.tix = Number(tix) || null;
    }
}