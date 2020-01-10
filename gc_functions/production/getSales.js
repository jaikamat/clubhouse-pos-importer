const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const cors = require('cors');
const DATABASE_NAME = 'clubhouse_collection_production';
require('dotenv').config();

/**
 * Initialize express app and use CORS middleware
 */
const app = express();
app.use(cors());

async function getSales(cardName) {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        const db = client.db(DATABASE_NAME);

        // Returns only the relevant queried cards from the card_list array of cards involved in the sale
        // Refer to https://blog.fullstacktraining.com/retrieve-only-queried-element-in-an-object-array-in-mongodb-collection/
        const data = await db.collection('sales_data').aggregate([
            { $match: { 'card_list.name': cardName } },
            {
                $project: {
                    card_list: {
                        $filter: {
                            input: '$card_list',
                            as: 'card_list',
                            cond: { $eq: ['$$card_list.name', cardName] }
                        }
                    },
                    sale_data: 1
                }
            }
        ]);

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
        const { cardName } = req.query;
        const message = await getSales(cardName);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

exports.getSales = app;
