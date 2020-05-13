const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());

/**
 * Replaces dollar signs and commas and yields a numbered price
 * @param {String} price - A string of format $dd,ddd.dd
 */
function convertPriceStr(price) {
    const converted = Number(price.replace('$', '').replace(',', ''));
    if (Number.isNaN(converted)) return null;
    return converted;
}

/**
 * Retrieves the purchase URL from a card by querying Scryfall's API
 * @param {String} scryfallId - a card's Scryfall ID
 */
async function getPurchaseUrl(scryfallId) {
    try {
        const SCRYFALL_ID_SEARCH = 'https://api.scryfall.com/cards';
        const { data } = await axios.get(`${SCRYFALL_ID_SEARCH}/${scryfallId}`);
        const { purchase_uris } = data;

        if (purchase_uris.tcgplayer) return purchase_uris.tcgplayer; // This is the purhase URL from Scryfall data
        else throw new Error(`Purchase URI for Scryfall ID ${scryfallId} not found`);
    } catch (e) {
        throw e;
    }
}

/**
 * Parses TCGplayer's card page html to retrieve the median price
 * @param {String} purchaseUrl - The TCGplayer purchase URL
 */
async function parseTcgHtml(purchaseUrl) {
    try {
        const { data } = await axios.get(purchaseUrl); // `data` is the html
        const $ = cheerio.load(data);
        const prices = {};
        // Capture the Median Price table and loop over its rows to capture price data
        $('.price-point--listed-median tbody tr').each((i, el) => {
            const finishTxt = $(el).find('th.price-point__name').text();
            const priceTxt = $(el).find('td.price-point__data').text();
            prices[finishTxt.toLowerCase()] = convertPriceStr(priceTxt);
        });

        return prices;
    } catch (e) {
        throw e;
    }
}

// Route handler
app.get('/', async (req, res, next) => {
    try {
        const { scryfallId } = req.query;
        const purchaseUrl = await getPurchaseUrl(scryfallId);
        const prices = await parseTcgHtml(purchaseUrl);

        res.json(prices);
    } catch (e) {
        next(e);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err.stack
    });
});

exports.getPriceFromTcg = app;