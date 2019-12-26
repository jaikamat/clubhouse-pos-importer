const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

async function getCardsByTitle(title) {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        const db = client.db('test');

        const data = await db.collection('card_inventory').find({
            name: title
        });

        return await data.toArray();
    } catch (err) {
        console.log(err);
        return err;
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
    }
}

exports.getCardsByTitle = async (req, res) => {
    res.set('Access-Control-Allow-Headers', '*');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');

    try {
        const { title } = req.query;
        const message = await getCardsByTitle(title);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

exports.getCardsByTitle = getCardsByTitle;
