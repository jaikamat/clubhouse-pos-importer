const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DATABASE_NAME = 'test';

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

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

module.exports = router;
