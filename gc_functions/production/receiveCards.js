const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const DATABASE_NAME = 'clubhouse_collection_production';
const COLLECTION = 'card_inventory';
require('dotenv').config();

function validateOne({ id, quantity, finishCondition, name, set, set_name }) {
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

    if (!id) throw new Error(`Card id must be provided`)
    if (!name) throw new Error(`Card name must be provided for ${id}`);
    if (!set) throw new Error(`Card set abbreviation must be provided for ${id}`);
    if (!set_name) throw new Error(`Card set name must be provided for ${id}`);
    if (typeof quantity !== 'number') throw new Error(`Card quantity formatted incorrectly for ${name}`);
    if (finishes.indexOf(finishCondition) < 0) throw new Error(`FinishCondition not a defined type for ${name}`);
    return;
}

// `finishCondition` Refers to the configuration of Finishes and Conditions ex. NONFOIL_NM or FOIL_LP
async function addCardToInventory({ quantity, finishCondition, id, name, set_name, set }) {
    const mongoConfig = { useNewUrlParser: true, useUnifiedTopology: true }

    try {
        var client = await new MongoClient(process.env.MONGO_URI, mongoConfig).connect();

        console.log(`Receiving Info: QTY:${quantity}, ${finishCondition}, ${name}, ${id}`);

        const db = client.db(DATABASE_NAME).collection(COLLECTION);

        // Upsert the new quantity in the document
        return await db.updateOne(
            { _id: id },
            {
                $inc: {
                    [`qoh.${finishCondition}`]: quantity
                },
                $setOnInsert: { name, set_name, set }
            },
            { upsert: true }
        );
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}

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
 * Sanitizes card object properties so nothing funky is committed to the database
 */
app.use((req, res, next) => {
    const { cards } = req.body;

    try {
        for (let card of cards) validateOne(card);
        return next();
    } catch (err) {
        res.status(400).send(err.message);
    }
})

app.post('/', async (req, res) => {
    try {
        const { cards } = req.body;
        const promises = cards.map(async c => addCardToInventory(c));
        const messages = await Promise.all(promises);

        res.status(200).send(messages);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

exports.receiveCards = app;