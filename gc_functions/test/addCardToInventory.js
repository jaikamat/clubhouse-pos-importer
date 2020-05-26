const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const DATABASE_NAME = 'test';
const COLLECTION = 'card_inventory';
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
 * Sanitizes card object properties so nothing funky is committed to the database
 */
app.use((req, res, next) => {
    const { quantity, finishCondition, cardInfo } = req.body;
    const { name, id } = cardInfo;
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
        res.status(400).send(`Card id must be provided`);
    if (!name)
        res.status(400).send(`Card name must be provided for ${id}`);
    if (typeof quantity !== 'number')
        res.status(400).send(`Card quantity formatted incorrectly for ${name}`);
    if (finishes.indexOf(finishCondition) < 0)
        res.status(400).send(`FinishCondition not a defined type for ${name}`);

    return next();
})

// `finishCondition` Refers to the configuration of Finishes and Conditions ex. NONFOIL_NM or FOIL_LP
async function addCardToInventory({ quantity, finishCondition, id, name, set_name, set }) {
    const mongoConfig = { useNewUrlParser: true, useUnifiedTopology: true }

    try {
        var client = await new MongoClient(process.env.MONGO_URI, mongoConfig).connect();

        console.log(`Update Info: QTY:${quantity}, ${finishCondition}, ${name}, ${id}`);

        const db = client.db(DATABASE_NAME).collection(COLLECTION);

        // Upsert the new quantity in the document
        await db.updateOne(
            { _id: id },
            {
                $inc: {
                    [`qoh.${finishCondition}`]: quantity
                },
                $setOnInsert: { name, set_name, set }
            },
            { upsert: true }
        );

        // Validate inventory quantites to never be negative numbers
        await db.updateOne(
            {
                _id: id,
                [`qoh.${finishCondition}`]: { $lt: 0 }
            },
            {
                $set: { [`qoh.${finishCondition}`]: 0 }
            }
        );

        // Get the updated document for return
        return await db.findOne(
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

app.post('/', async (req, res) => {
    try {
        const { quantity, finishCondition, cardInfo } = req.body;
        const { id, name, set_name, set } = cardInfo;
        const message = await addCardToInventory({ quantity, finishCondition, id, name, set_name, set });
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

exports.addCardToInventory = app;
