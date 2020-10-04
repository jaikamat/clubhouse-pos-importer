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

router.post('/', async (req, res) => {
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

module.exports = router;
