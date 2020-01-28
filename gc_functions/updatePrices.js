const fs = require('fs');
const superagent = require('superagent');
const Bottleneck = require('bottleneck');
const sourceJSON = require('../clubhouse_data/scryfall-default-cards.json');
require('dotenv').config();

const startTime = process.hrtime(); // Record time
const limiter = new Bottleneck({ maxConcurrent: 1, minTime: 125 }); // 8 requests per second

/**
 * Makes a request to scryfall for a card's data (with retries)
 * @param {String} cardID
 */
async function retrievePrice(cardID) {
    try {
        const { body } = await superagent.get(`https://api.scryfall.com/cards/${cardID}`).retry(3);
        const { id, name, set, set_name, prices } = body;

        // Cast from String to Number
        const usd = Number(prices.usd) || null;
        const usd_foil = Number(prices.usd_foil) || null;
        const eur = Number(prices.eur) || null;
        const tix = Number(prices.tix) || null;

        console.log(`${name} | ${set_name} (${set}) | ${JSON.stringify({ usd, usd_foil, eur, tix })}`);

        return { _id: id, name, set, set_name, prices: { usd, usd_foil, eur, tix } };
    } catch (err) {
        console.log(err);
    }
}

// Filter the source dataset to exclude cards not in 'paper'
const sourceFiltered = sourceJSON.filter(card => {
    return card.games.indexOf('paper') > -1;
});

// Wrap each GET request with the limiter to throttle
const throttledRetrievePrice = limiter.wrap(retrievePrice);

// Create the list of Promises
const allRequestPromises = sourceFiltered.map(d => throttledRetrievePrice(d.id))

/**
 * Rate-limits the full list of Promises using Bottleneck
 * Writes them to a file
 */
async function getAllPrices() {
    try {
        const results = await Promise.all(allRequestPromises);
        // If requests fail, the array value will be null and will block the mongoImport - remove them
        const filteredResults = results.filter(d => d !== null);
        fs.writeFileSync('./prices.json', JSON.stringify(filteredResults));
        const endTime = process.hrtime(startTime);
        console.info(`Completion time: ${endTime[0] / 60} minutes`);
        console.log(`${results.length} objects created from ${sourceJSON.length} source objects`);
    } catch (err) {
        console.log(err);
    }
}

getAllPrices();