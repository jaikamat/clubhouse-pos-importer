const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const cors = require('cors');
const DATABASE_NAME = 'test';
const LIMIT = 100;
require('dotenv').config();

/**
 * Initialize express app and use CORS middleware
 */
const app = express();
app.use(cors());

/**
 * Gets a list of all set names, for use in the Deckbox frontend dropdown selection
 */
async function getDistinctSetNames() {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        const db = client.db(DATABASE_NAME);

        return await db.collection('card_inventory').distinct('set_name');
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
    }
}

/**
 * Uses the Mongo Aggregation Pipeline to gather relevant cards in an itemized list
 *
 * @param {Object} param0 Object with multiple optional properties:
 * title - name of the card
 * setName - the full name of the set
 * format - format in which the card is legal
 * priceNum - the price to query on. Used in conjunciton with priceFilter
 * priceFilter - gt, gte, lt, or lte. Used with Mongo aggregation to find price relations
 * finish - `FOIL` or `NONFOIL`
 * sortBy - `name` or `price`
 * sortByDirection - `1` or `-1`
 * page - used to modify internal SKIP constant for pagination
 */
async function getCardsByFilter({ title, setName, format, priceNum, priceFilter, finish, color, colorIdentity, sortBy, sortByDirection, page }) {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        const db = client.db(DATABASE_NAME);
        const SKIP = LIMIT * (Math.abs((Number(page)) || 1) - 1); // `page` starts at 1 for clarity

        // Build the initialMatch
        const initialMatch = {};

        if (title) initialMatch.name = title; // TODO: This should search on substrings as well
        if (setName) initialMatch.set_name = setName;
        if (format) initialMatch[`legalities.${format}`] = { $in: ['restricted', 'legal'] };

        // Building the end match
        const endMatch = {};

        // End match foiling logic
        if (finish === 'FOIL') {
            endMatch['inventory.k'] = { $in: ['FOIL_NM', 'FOIL_LP', 'FOIL_MP', 'FOIL_HP'] }
        } else if (finish === 'NONFOIL') {
            endMatch['inventory.k'] = { $in: ['NONFOIL_NM', 'NONFOIL_LP', 'NONFOIL_MP', 'NONFOIL_HP'] }
        }

        // Always ensure results are in stock
        endMatch[`inventory.v`] = { $gt: 0 };

        // Price filtering logic
        if (priceNum && priceFilter) {
            endMatch.price = { [`$${priceFilter}`]: Number(priceNum) }
        }

        // Passed to the $sort pipeline operator
        const sortByFilter = {};

        const sortByProp = sortBy || 'price';
        const sortByDirectionProp = Number(sortByDirection) || -1;

        sortByFilter[sortByProp] = sortByDirectionProp;

        const docs = await db.collection('card_inventory').aggregate([
            {
                $match: initialMatch
            }, {
                $lookup: {
                    from: "scryfall_pricing_data",
                    localField: "_id",
                    foreignField: "_id",
                    as: "price_info"
                }
            }, {
                $addFields: {
                    image_uri: {
                        $ifNull: ['$image_uris.normal', {
                            // If the card is a flip card, its image uri will be nested in the card_faces property.
                            // We use the $let operator to evaluate its contents to a temp variable `image` and extract the image_uri
                            $let: {
                                vars: { image: { $arrayElemAt: ['$card_faces', 0] } },
                                in: '$$image.image_uris.normal'
                            }
                        }]
                    },
                    price_info: { $arrayElemAt: ["$price_info.prices", 0] },
                    inventory: { $objectToArray: "$qoh" }
                }
            }, {
                $unwind: '$inventory'
            }, {
                $project: {
                    _id: 1,
                    name: 1,
                    set_name: 1,
                    set: 1,
                    inventory: 1,
                    price: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$inventory.k", "NONFOIL_NM"] }, then: "$price_info.usd" },
                                { case: { $eq: ["$inventory.k", "NONFOIL_LP"] }, then: "$price_info.usd" },
                                { case: { $eq: ["$inventory.k", "NONFOIL_MP"] }, then: "$price_info.usd" },
                                { case: { $eq: ["$inventory.k", "NONFOIL_HP"] }, then: "$price_info.usd" },
                                { case: { $eq: ["$inventory.k", "FOIL_NM"] }, then: "$price_info.usd_foil" },
                                { case: { $eq: ["$inventory.k", "FOIL_LP"] }, then: "$price_info.usd_foil" },
                                { case: { $eq: ["$inventory.k", "FOIL_MP"] }, then: "$price_info.usd_foil" },
                                { case: { $eq: ["$inventory.k", "FOIL_HP"] }, then: "$price_info.usd_foil" }
                            ]
                        }
                    },
                    image_uri: 1,
                    rarity: 1
                }
            }, {
                $match: endMatch
            }, {
                $sort: sortByFilter
            }, {
                $facet: {
                    cards: [
                        { $skip: SKIP },
                        { $limit: LIMIT }
                    ],
                    total_count: [
                        { $count: 'num' }
                    ]
                }
            }
        ]).toArray();

        const output = {};

        output.cards = docs[0].cards ? docs[0].cards : [];
        output.total = docs[0].total_count[0] ? docs[0].total_count[0].num : 0;

        return output;

    } catch (err) {
        console.log(err);
        return err;
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
    }
}

app.get('/set_names', async (req, res) => {
    try {
        const names = await getDistinctSetNames();
        res.status(200).send(names);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

app.get('/', async (req, res) => {
    try {
        const { title, setName, format, priceNum, priceFilter, finish, color, colorIdentity, sortBy, sortByDirection, page } = req.query;
        const message = await getCardsByFilter({
            title, setName, format, priceNum, priceFilter, finish, color, colorIdentity, sortBy, sortByDirection, page
        });
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

exports.getCardsByFilter = app;
