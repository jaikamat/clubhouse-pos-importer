import axios from "axios";
import cors from "cors";
import express from "express";

interface TcgPriceData {
    normal: number | null;
    foil: number | null;
}

interface TcgPlayerIds {
    standard: string | null;
    etched: string | null;
}

interface ChcollectorPrice {
    normal: number | null;
    foil: number | null;
    etched: number | null;
}

interface Result {
    marketPrices: ChcollectorPrice;
    medianPrices: ChcollectorPrice;
}

type UrlCreator<T> = (arg: T) => T;

const scryfallEndpoint: UrlCreator<string> = (scryfallId) =>
    `https://api.scryfall.com/cards/${scryfallId}`;

const pricingEndpoint: UrlCreator<string> = (sku) =>
    `https://mpapi.tcgplayer.com/v2/product/${sku}/pricepoints`;

/**
 * Retrieves the SKU from a card by querying Scryfall's API
 */
const fetchTcgPlayerSkus = async (
    scryfallId: string
): Promise<TcgPlayerIds> => {
    try {
        const result: TcgPlayerIds = {
            standard: null,
            etched: null,
        };

        const { data } = await axios.get(scryfallEndpoint(scryfallId));

        if (data.tcgplayer_id) {
            result.standard = data.tcgplayer_id;
        }

        if (data.tcgplayer_etched_id) {
            result.etched = data.tcgplayer_etched_id;
        }

        return result;
    } catch (err) {
        throw err;
    }
};

const fetchPrices = async (sku: string) => {
    const marketPrices: TcgPriceData = {
        normal: null,
        foil: null,
    };
    const medianPrices: TcgPriceData = {
        normal: null,
        foil: null,
    };

    if (!sku) {
        return { marketPrices, medianPrices };
    }

    try {
        const { data } = await axios.get(pricingEndpoint(sku));

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
};

// Create server and configure
const app = express();
app.use(cors());

// Route handler
app.get("/", async (req, res, next) => {
    try {
        const result: Result = {
            marketPrices: {
                normal: null,
                foil: null,
                etched: null,
            },
            medianPrices: {
                normal: null,
                foil: null,
                etched: null,
            },
        };

        const { scryfallId } = req.query;
        const tcgplayerIds = await fetchTcgPlayerSkus(scryfallId);

        if (tcgplayerIds.standard) {
            const standardPrices = await fetchPrices(tcgplayerIds.standard);

            result.marketPrices.normal = standardPrices.marketPrices.normal;
            result.marketPrices.foil = standardPrices.marketPrices.foil;

            result.medianPrices.normal = standardPrices.medianPrices.normal;
            result.medianPrices.foil = standardPrices.medianPrices.foil;
        }

        if (tcgplayerIds.etched) {
            const etchedPrices = await fetchPrices(tcgplayerIds.etched);

            // TcgPlayer doesn't make an `etched` distinction, they are `foil` in their API
            result.marketPrices.etched = etchedPrices.marketPrices.foil;
            result.medianPrices.etched = etchedPrices.medianPrices.foil;
        }

        res.json(result);
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
