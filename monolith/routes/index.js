const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DATABASE_NAME = 'test';
const LIMIT = 100;

async function getJwt(username, submittedPass) {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        const db = client.db(DATABASE_NAME);

        const user = await db.collection('users').findOne({
            username: username,
        });

        if (!user) return 'Not authorized';

        // Determine if the fetched user is authorized
        const match = await bcrypt.compareSync(submittedPass, user.password);

        if (match) {
            const token = jwt.sign(
                { username: username, admin: true },
                process.env.PRIVATE_KEY
            );

            return { token: token };
        } else {
            return 'Not authorized';
        }
    } catch (err) {
        console.log(err);
        return err;
    } finally {
        await client.close();
        console.log('Disconnected from Mongo');
    }
}

router.post('/jwt', async (req, res) => {
    try {
        const { username, password } = req.body;
        const token = await getJwt(username, password);
        res.status(200).send(token);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

async function getCardQuantitiesFromInventory(scryfallIds) {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        const db = client.db(DATABASE_NAME);

        const data = await db.collection('card_inventory').find(
            {
                _id: { $in: scryfallIds },
            },
            {
                projection: {
                    _id: true,
                    qoh: true,
                },
            }
        );

        const documents = await data.toArray();

        const res = {};

        documents.forEach((d) => (res[d._id] = d.qoh));

        return res;
    } catch (err) {
        console.log(err);
        return err;
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
    }
}

router.post('/getCardQuantitiesFromInventory', async (req, res) => {
    try {
        const { scryfallIds } = req.body;
        const message = await getCardQuantitiesFromInventory(scryfallIds);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

async function getCardsWithInfo(title, matchInStock = false) {
    // if matchInStock is false, we get all cards, even those with no stock
    const mongoConfig = { useNewUrlParser: true, useUnifiedTopology: true };

    try {
        var client = await new MongoClient(
            process.env.MONGO_URI,
            mongoConfig
        ).connect();
        console.log('Successfully connected to mongo');

        const db = client.db(DATABASE_NAME);

        const pipeline = [];

        // Fetch by title
        const match = {
            $match: {
                name: title,
                games: {
                    $in: ['paper'],
                },
            },
        };

        // Zip up bulk with qoh
        const lookup = {
            $lookup: {
                from: 'card_inventory',
                localField: 'id',
                foreignField: '_id',
                as: 'qoh',
            },
        };

        // $lookup yields an array - replace the new qoh with the nested card value
        const addFields = {
            $addFields: {
                qoh: { $arrayElemAt: ['$qoh.qoh', 0] },
            },
        };

        // Only yield cards that are in-stock, if needed
        const inventoryMatch = {
            $match: {
                $or: [
                    { 'qoh.FOIL_NM': { $gt: 0 } },
                    { 'qoh.FOIL_LP': { $gt: 0 } },
                    { 'qoh.FOIL_MP': { $gt: 0 } },
                    { 'qoh.FOIL_HP': { $gt: 0 } },
                    { 'qoh.NONFOIL_NM': { $gt: 0 } },
                    { 'qoh.NONFOIL_LP': { $gt: 0 } },
                    { 'qoh.NONFOIL_MP': { $gt: 0 } },
                    { 'qoh.NONFOIL_HP': { $gt: 0 } },
                ],
            },
        };

        pipeline.push(match);
        pipeline.push(lookup);
        pipeline.push(addFields);
        if (matchInStock) pipeline.push(inventoryMatch);

        return await db
            .collection('scryfall_bulk_cards')
            .aggregate(pipeline)
            .toArray();
    } catch (err) {
        console.log(err);
        return err;
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
    }
}

router.get('/getCardsWithInfo', async (req, res) => {
    try {
        const { title, matchInStock } = req.query;
        const myMatch = matchInStock === 'true';

        const message = await getCardsWithInfo(title, myMatch);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

/**
 * Gets a list of all set names, for use in the Deckbox frontend dropdown selection
 */
async function getDistinctSetNames() {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();

        const db = client.db(DATABASE_NAME);

        return await db.collection('card_inventory').distinct('set_name');
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
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
 * colors - a sorted string, used to identify cards by one or more colors
 * type - the typeline search, like `Artifact` or `Creature`
 * frame - the desired frame effect filter (borderless, extended-art, showcase, etc)
 */
async function getCardsByFilter({
    title,
    setName,
    format,
    priceNum,
    priceFilter,
    finish,
    colors,
    sortBy,
    sortByDirection,
    page,
    type,
    frame,
}) {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();

        const db = client.db(DATABASE_NAME);
        const SKIP = LIMIT * (Math.abs(Number(page) || 1) - 1); // `page` starts at 1 for clarity

        // Create aggregation
        const aggregation = [];

        // Build the initialMatch
        const initialMatch = {};

        if (title) initialMatch.name = { $regex: `${title}`, $options: 'i' };
        if (setName) initialMatch.set_name = setName;

        aggregation.push({ $match: initialMatch });

        // Attach bulk card information
        aggregation.push({
            $lookup: {
                from: 'scryfall_bulk_cards',
                localField: '_id',
                foreignField: 'id',
                as: 'bulk_match',
            },
        });

        // Merge the bulk and pricing collection properties
        aggregation.push({
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        { $arrayElemAt: ['$bulk_match', 0] },
                        '$$ROOT',
                    ],
                },
            },
        });

        const typeMatch = {};

        // Types are Tribal, Instant, Sorcery, Creature, Enchantment, Land, Planeswalker, Artifact
        if (type) typeMatch.type_line = { $regex: `${type}`, $options: 'i' };

        aggregation.push({ $match: typeMatch });

        const borderMatch = {};
        const showcaseMatch = {};
        const extendedArtMatch = {};

        // Matches borderless art only
        borderMatch.border_color = 'borderless';

        // Matches extended art cards
        extendedArtMatch.frame_effects = 'extendedart';

        // Matches showcase art cards
        showcaseMatch.frame_effects = 'showcase';

        if (frame === 'borderless') {
            aggregation.push({ $match: borderMatch });
        }

        if (frame === 'extendedArt') {
            aggregation.push({ $match: extendedArtMatch });
        }

        if (frame === 'showcase') {
            aggregation.push({ $match: showcaseMatch });
        }

        const addFields = {
            image_uri: {
                $ifNull: [
                    '$image_uris.normal',
                    {
                        // If the card is a flip card, its image uri will be nested in the card_faces property.
                        // We use the $let operator to evaluate its contents to a temp variable `image` and extract the image_uri
                        $let: {
                            vars: {
                                image: { $arrayElemAt: ['$card_faces', 0] },
                            },
                            in: '$$image.image_uris.normal',
                        },
                    },
                ],
            },
            // NOTE: This is dependent on Scryfall sorting their color arrays in 'BGRUW' order
            colors_string: {
                $ifNull: [
                    {
                        $reduce: {
                            input: '$colors',
                            initialValue: '',
                            in: { $concat: ['$$value', '$$this'] },
                        },
                    },
                    {
                        // If the card is a flip card, its colors will be nested in the card_faces property.
                        // We use the $let operator to evaluate its contents to a temp variable `colors` and extract the colors array
                        $let: {
                            vars: {
                                colors: { $arrayElemAt: ['$card_faces', 0] },
                            },
                            // Here, we concat the array to a single string to $match on a substring
                            in: {
                                $reduce: {
                                    input: '$$colors.colors',
                                    initialValue: '',
                                    in: { $concat: ['$$value', '$$this'] },
                                },
                            },
                        },
                    },
                ],
            },
            inventory: { $objectToArray: '$qoh' },
        };

        aggregation.push({ $addFields: addFields });

        aggregation.push({ $unwind: '$inventory' });

        aggregation.push({
            $project: {
                _id: 1,
                name: 1,
                set_name: 1,
                set: 1,
                inventory: 1,
                price: {
                    $switch: {
                        branches: [
                            {
                                case: { $eq: ['$inventory.k', 'NONFOIL_NM'] },
                                then: '$prices.usd',
                            },
                            {
                                case: { $eq: ['$inventory.k', 'NONFOIL_LP'] },
                                then: '$prices.usd',
                            },
                            {
                                case: { $eq: ['$inventory.k', 'NONFOIL_MP'] },
                                then: '$prices.usd',
                            },
                            {
                                case: { $eq: ['$inventory.k', 'NONFOIL_HP'] },
                                then: '$prices.usd',
                            },
                            {
                                case: { $eq: ['$inventory.k', 'FOIL_NM'] },
                                then: '$prices.usd_foil',
                            },
                            {
                                case: { $eq: ['$inventory.k', 'FOIL_LP'] },
                                then: '$prices.usd_foil',
                            },
                            {
                                case: { $eq: ['$inventory.k', 'FOIL_MP'] },
                                then: '$prices.usd_foil',
                            },
                            {
                                case: { $eq: ['$inventory.k', 'FOIL_HP'] },
                                then: '$prices.usd_foil',
                            },
                        ],
                    },
                },
                image_uri: 1,
                rarity: 1,
                colors_string: 1,
                legalities: 1,
                type_line: 1,
                prices: 1,
                printed_name: 1,
                flavor_name: 1,
                border_color: 1,
                frame_effects: 1,
            },
        });

        // Building the end match
        const endMatch = {};

        // End match foiling logic
        if (finish === 'FOIL') {
            endMatch['inventory.k'] = {
                $in: ['FOIL_NM', 'FOIL_LP', 'FOIL_MP', 'FOIL_HP'],
            };
        } else if (finish === 'NONFOIL') {
            endMatch['inventory.k'] = {
                $in: ['NONFOIL_NM', 'NONFOIL_LP', 'NONFOIL_MP', 'NONFOIL_HP'],
            };
        }

        // End match format legality logic
        if (format)
            endMatch[`legalities.${format}`] = { $in: ['restricted', 'legal'] };

        // End match colors matching logic
        if (colors) endMatch.colors_string = colors;

        // Always ensure results are in stock
        endMatch[`inventory.v`] = { $gt: 0 };

        // Price filtering logic
        if (priceNum && priceFilter) {
            endMatch.price = { [`$${priceFilter}`]: Number(priceNum) };
        }

        aggregation.push({ $match: endMatch });

        const sortByFilter = {};
        const sortByProp = sortBy || 'price';
        const sortByDirectionProp = Number(sortByDirection) || -1;
        sortByFilter[sortByProp] = sortByDirectionProp;

        aggregation.push({ $sort: sortByFilter });

        aggregation.push({
            $facet: {
                cards: [{ $skip: SKIP }, { $limit: LIMIT }],
                total_count: [{ $count: 'num' }],
            },
        });

        const docs = await db
            .collection('card_inventory')
            .aggregate(aggregation)
            .toArray();

        const output = {};

        output.cards = docs[0].cards ? docs[0].cards : [];
        output.total = docs[0].total_count[0] ? docs[0].total_count[0].num : 0;

        return output;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}

router.get('/getDistinctSetNames', async (req, res) => {
    try {
        const names = await getDistinctSetNames();
        res.status(200).send(names);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/getCardsByFilter', async (req, res) => {
    try {
        const {
            title,
            setName,
            format,
            priceNum,
            priceFilter,
            finish,
            colors,
            colorIdentity,
            sortBy,
            sortByDirection,
            page,
            type,
            frame,
        } = req.query;

        const message = await getCardsByFilter({
            title,
            setName,
            format,
            priceNum,
            priceFilter,
            finish,
            colors,
            colorIdentity,
            sortBy,
            sortByDirection,
            page,
            type,
            frame,
        });

        res.status(200).json(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;
