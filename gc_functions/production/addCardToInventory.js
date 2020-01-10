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

// `type` Refers to the configuration of Finishes and Conditions
async function addCardToInventory(quantity, type, cardInfo) {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        console.log(
            `Update Info: QTY:${quantity}, ${type}, ${cardInfo.name}, ${cardInfo.id}`
        );

        const db = client.db(DATABASE_NAME);

        // Upsert the new quantity in the document
        await db.collection('card_inventory').findOneAndUpdate(
            { _id: cardInfo.id },
            {
                $inc: {
                    [`qoh.${type}`]: quantity
                },
                $setOnInsert: cardInfo
            },
            {
                upsert: true,
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
                _id: cardInfo.id,
                [`qoh.${type}`]: { $lt: 0 }
            },
            { $set: { [`qoh.${type}`]: 0 } }
        );

        // Get the updated document for return
        return await db.collection('card_inventory').findOne(
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
        return err;
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
    }
}

app.post('/', async (req, res) => {
    try {
        const { quantity, type, cardInfo } = req.body;
        const message = await addCardToInventory(quantity, type, cardInfo);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

exports.addCardToInventory = app;
