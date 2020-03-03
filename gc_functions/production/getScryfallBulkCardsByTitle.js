const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const cors = require('cors');
const DATABASE_NAME = 'clubhouse_collection_production';
const COLLECTION = 'scryfall_bulk_cards';
require('dotenv').config();

/**
 * Initialize express app and use CORS middleware
 */
const app = express();
app.use(cors());

/**
 * Specifially fetches card data from a table of Scryfall bulk data cards (by title)
 * @param {string} title 
 */
async function getScryfallBulkCardsByTitle(title) {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        const db = client.db(DATABASE_NAME);

        const data = await db.collection(COLLECTION).find({
            name: title,
            games: 'paper'// searches the 'games' array for cards specific to paper printings
            // Need to suppress returning the _id to prevent collisions with own inventory DB
        }, {
            projection: { _id: false }
        })

        return await data.toArray();
    } catch (err) {
        console.log(err);
        return err;
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
    }
}

app.get('/', async (req, res) => {
    try {
        const { title } = req.query;
        const message = await getScryfallBulkCardsByTitle(title);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

exports.getScryfallBulkCardsByTitle = app;
