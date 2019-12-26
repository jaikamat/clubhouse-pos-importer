const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

async function getCardQuantitiesFromInventory(scryfallIds) {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        const db = client.db('test');

        const data = await db.collection('card_inventory').find(
            {
                _id: { $in: scryfallIds }
            },
            {
                projection: {
                    _id: true,
                    qoh: true
                }
            }
        );

        const documents = await data.toArray();

        const res = {};

        documents.forEach(d => (res[d._id] = d.qoh));

        return res;
    } catch (err) {
        console.log(err);
        return err;
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
    }
}

exports.getCardQuantitiesFromInventory = async (req, res) => {
    res.set('Access-Control-Allow-Headers', '*');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');

    try {
        const { scryfallIds } = req.body;
        const message = await getCardQuantitiesFromInventory(scryfallIds);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

exports.getCardQuantitiesFromInventory = getCardQuantitiesFromInventory;
