const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const cors = require('cors');
const COLLECTION = 'scryfall_bulk_cards';
const INVENTORY_COLL = 'card_inventory';
const DATABASE_NAME = 'test';
require('dotenv').config();

/**
 * Initialize express app and use CORS middleware
 */
const app = express();
app.use(cors());

async function getCardsWithInfo(title, matchInStock = false) {
    const mongoConfig = { useNewUrlParser: true, useUnifiedTopology: true };

    try {
        var client = await new MongoClient(process.env.MONGO_URI, mongoConfig).connect();
        console.log('Successfully connected to mongo');

        const db = client.db(DATABASE_NAME);

        const pipeline = [];

        // Fetch by title
        const match = {
            $match: {
                name: title,
                games: {
                    $in: ['paper']
                }
            }
        };

        // Zip up bulk with qoh
        const lookup = {
            $lookup: {
                from: INVENTORY_COLL,
                localField: 'id',
                foreignField: '_id',
                as: 'qoh'
            }
        };

        // $lookup yields an array - replace the new qoh with the nested card value
        const addFields = {
            $addFields: {
                qoh: { $arrayElemAt: ['$qoh.qoh', 0] }
            }
        };

        // Only yield cards that are in-stock, if needed
        const inventoryMatch = {
            $match: {
                $or: [
                    { "qoh.FOIL_NM": { $gt: 0 } },
                    { "qoh.FOIL_LP": { $gt: 0 } },
                    { "qoh.FOIL_MP": { $gt: 0 } },
                    { "qoh.FOIL_HP": { $gt: 0 } },
                    { "qoh.NONFOIL_NM": { $gt: 0 } },
                    { "qoh.NONFOIL_LP": { $gt: 0 } },
                    { "qoh.NONFOIL_MP": { $gt: 0 } },
                    { "qoh.NONFOIL_HP": { $gt: 0 } }
                ]
            }
        };

        pipeline.push(match);
        pipeline.push(lookup);
        pipeline.push(addFields);
        if (matchInStock) pipeline.push(inventoryMatch);

        return await db.collection(COLLECTION).aggregate(pipeline).toArray();
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
        const { title, matchInStock } = req.query;
        const myMatch = matchInStock === 'true';

        const message = await getCardsWithInfo(title, myMatch);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

exports.getCardsWithInfo = app;
