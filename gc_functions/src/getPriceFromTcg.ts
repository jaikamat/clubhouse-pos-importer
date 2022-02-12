const express = require("express");
const cors = require("cors");
const axios = require("axios");

interface Price {
    normal?: number;
    foil?: number;
}

const app = express();
app.use(cors());

const scryfallEndpoint = (scryfallId) =>
    `https://api.scryfall.com/cards/${scryfallId}`;

const pricingEndpoint = (sku) =>
    `https://mpapi.tcgplayer.com/v2/product/${sku}/pricepoints`;

/**
 * Retrieves the SKU from a card by querying Scryfall's API
 * @param {String} scryfallId - a card's Scryfall ID
 */
async function fetchSku(scryfallId) {
    try {
        const { data } = await axios.get(scryfallEndpoint(scryfallId));

        if (!data.tcgplayer_id) {
            return null;
        }

        return data.tcgplayer_id;
    } catch (err) {
        throw err;
    }
}

async function fetchPrices(sku) {
    const marketPrices: Price = {};
    const medianPrices: Price = {};

    if (!sku) {
        return { marketPrices, medianPrices };
    }

    try {
        const { data } = await axios.get(pricingEndpoint(sku));

        console.log({ data });

        // Need to convert prices to our app's data shape
        const normalTcgPrices = data.find((d) => d.printingType === "Normal");
        const foilTcgPrices = data.find((d) => d.printingType === "Foil");

        if (normalTcgPrices) {
            marketPrices.normal = normalTcgPrices.marketPrice;
            medianPrices.normal = normalTcgPrices.listedMedianPrice;
        }

        if (foilTcgPrices) {
            marketPrices.foil = foilTcgPrices.marketPrice;
            medianPrices.foil = foilTcgPrices.listedMedianPrice;
        }

        return { marketPrices, medianPrices };
    } catch (err) {
        throw err;
    }
}

// Route handler
app.get("/", async (req, res, next) => {
    try {
        const { scryfallId } = req.query;
        const sku = await fetchSku(scryfallId);
        const prices = await fetchPrices(sku);

        res.json(prices);
    } catch (err) {
        next(err);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err.stack,
    });
});

exports.getPriceFromTcg = app;
