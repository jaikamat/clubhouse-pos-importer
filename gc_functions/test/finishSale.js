const request = require('request-promise-native');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const DATABASE_NAME = 'test';
require('dotenv').config();

/**
 * Initialize express app and use CORS middleware
 */
const app = express();
app.use(cors());

/**
 * Middleware to check for Bearer token by validating JWT
 */
app.use((req, res, next) => {
    let token = req.headers['authorization']; // Express headers converted to lowercase

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        try {
            // Will throw error if validation fails
            jwt.verify(token, process.env.PRIVATE_KEY);
            return next();
        } catch (err) {
            res.status(401).send('Invalid token');
        }
    } else {
        res.status(401).send('No token present on request');
    }
})

/**
 * Sanitizes card array to ensure inputs are valid. Will throw errors and end sale if needed
 */
app.use((req, res, next) => {
    const { cards } = req.body;

    function sanitizeOne(card) {
        const { price, qtyToSell, finishCondition, name, set_name, id } = card;
        const finishes = [
            'NONFOIL_NM',
            'NONFOIL_LP',
            'NONFOIL_MP',
            'NONFOIL_HP',
            'FOIL_NM',
            'FOIL_LP',
            'FOIL_MP',
            'FOIL_HP'
        ];

        if (!id)
            throw new Error(`Card property id missing`);
        if (!name && !set_name)
            throw new Error(`Card name or set_name missing for ${id}`);
        if (typeof price !== 'number')
            throw new Error(`Price not number for ${name}`);
        if (price < 0)
            throw new Error(`Price must not be negative for ${name}`);
        if (typeof qtyToSell !== 'number' && qtyToSell % 2 !== 0)
            throw new Error(`qtyToSell formatted incorrectly for ${name}`);
        if (qtyToSell <= 0)
            throw new Error(`qtyToSell must be greater than 0 for ${name}`);
        if (finishes.indexOf(finishCondition) < 0)
            throw new Error(`FinishCondition not a defined type for ${name}`);
        return true;
    }

    try {
        for (let card of cards) { sanitizeOne(card) };
        return next();
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
})

/**
 * Helper fn used to create employee-readable note lines in the Lightspeed POS system
 * @param {Object} card - the card involved in the transaction
 */
function createSaleLine(card) {
    const { price, qtyToSell, finishCondition, name, set_name } = card;

    return `${name} | ${set_name} | Qty sold: ${qtyToSell} | Condition: ${finishCondition} | Price/unit: ${price}`;
}

/**
 * Updates the Mongo inventory based on the card's passed properties (qtyToSell, finishCondition, id, name)
 * @param {Object} card - the card involved in the transaction
 */
async function updateCardInventory(card) {
    const { qtyToSell, finishCondition, id, name } = card;

    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();

        console.log(
            `Update: QTY: ${qtyToSell}, ${finishCondition}, ${name}, ${id}`
        );

        const db = client.db(DATABASE_NAME);

        // Upsert the new qtyToSell in the document
        await db.collection('card_inventory').findOneAndUpdate(
            { _id: id },
            {
                $inc: {
                    [`qoh.${finishCondition}`]: -Math.abs(qtyToSell)
                }
            },
            {
                projection: {
                    _id: true,
                    qoh: true,
                    name: true,
                    setName: true,
                    set: true
                },
                returnOriginal: false
            }
        );

        // Validate inventory quantites to never be negative numbers
        await db.collection('card_inventory').updateOne(
            {
                _id: id,
                [`qoh.${finishCondition}`]: { $lt: 0 }
            },
            { $set: { [`qoh.${finishCondition}`]: 0 } }
        );

        // Get the updated document for return
        return await db.collection('card_inventory').findOne(
            { _id: id },
            {
                projection: {
                    _id: true,
                    qoh: true,
                    name: true,
                    setName: true,
                    set: true
                }
            }
        );
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}

/**
 * Creates a sale via the Lightspeed API
 *
 * @param {String} authToken - the store's OAuth access token
 * @param {Array} cards - array of cards involved in the sale
 */
async function createLightspeedSale(authToken, cards) {
    try {
        const url = `https://api.lightspeedapp.com/API/Account/${process.env.LIGHTSPEED_ACCT_ID}/Sale.json`;

        const config = {
            headers: { Authorization: `Bearer ${authToken}` }
        };

        const saleLines = cards.map(card => {
            return {
                Note: { note: createSaleLine(card) },
                taxClassID: 0,
                unitPrice: card.price,
                avgCost: 0,
                fifoCost: 0,
                unitQuantity: card.qtyToSell
            };
        });

        const bodyParameters = {
            completed: false,
            taxCategoryID: 0,
            employeeID: 1,
            shopID: 1, // Retro is the shop; Lance separates by register
            registerID: 2, // Designates The Clubhouse
            SaleLines: {
                SaleLine: saleLines
            }
        };

        return await axios.post(url, bodyParameters, config);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * Creates a sale persisted to Mongo
 *
 * @param saleData - the data returned by Lightspeed when creating a sale
 * @param cardList - an array of cards that were involved in the sale
 */
async function createSale(saleData, cardList) {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        console.log(`Creating new sale`);

        const db = client.db(DATABASE_NAME);

        return await db.collection('sales_data').insertOne({
            sale_data: saleData,
            card_list: cardList
        });
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}

/**
 * Main function that wraps the execution
 * @param {Array} cards - the cards involved in the transaction
 */
async function finishSale(cards) {
    try {
        const token = await request.get({
            url: process.env.REFRESH_LIGHTSPEED_AUTH_TOKEN
        });

        // Grab the Lightspeed access token from response
        const { access_token } = JSON.parse(token);

        // Create the Lightspeed sale
        const { data } = await createLightspeedSale(access_token, cards);

        // Map updated inserts after successful Lightspeed sale creation
        const dbInserts = cards.map(async card => {
            return await updateCardInventory(card);
        });

        // Persist the inventory changes
        const dbRes = await Promise.all(dbInserts);

        // Create and persist sale data
        await createSale(data.Sale, cards);

        return {
            cards_upserted: dbRes,
            sale_data: data
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * Create root POST route
 */
app.post('/', async (req, res) => {
    try {
        const { cards } = req.body;
        const data = await finishSale(cards);
        res.status(200).send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

// Export the app to GCF
exports.finishSale = app;
