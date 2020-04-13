const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const DATABASE_NAME = 'clubhouse_collection_production';
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
async function addCardToInventory(quantity, finishCondition, cardInfo) {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();

        console.log(`Update Info: QTY:${quantity}, ${finishCondition}, ${cardInfo.name}, ${cardInfo.id}`);

        const db = client.db(DATABASE_NAME).collection('card_inventory');

        // Upsert the new quantity in the document
        await db.updateOne(
            { _id: cardInfo.id },
            {
                $inc: {
                    [`qoh.${finishCondition}`]: quantity
                },
                $setOnInsert: cardInfo
            },
            { upsert: true }
        );

        // Validate inventory quantites to never be negative numbers
        await db.updateOne(
            {
                _id: cardInfo.id,
                [`qoh.${finishCondition}`]: { $lt: 0 }
            },
            {
                $set: { [`qoh.${finishCondition}`]: 0 }
            }
        );

        // Get the updated document for return
        return await db.findOne(
            { _id: cardInfo.id },
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
        const message = await addCardToInventory(quantity, finishCondition, cardInfo);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

exports.addCardToInventory = app;
