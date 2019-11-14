const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

async function getCardsFromInventory(scryfallIds) {
    const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0-uytsf.gcp.mongodb.net/test?retryWrites=true&w=majority`;
    const client = await new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    let status;

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
                    qoh: true,
                    name: true,
                    setName: true,
                    set: true
                }
            }
        );

        status = await data.toArray();
    } catch (err) {
        status = err;
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
        return status;
    }
}

exports.getCardsFromInventory = async (req, res) => {
    res.set('Access-Control-Allow-Headers', '*');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');

    try {
        const { scryfallIds } = req.body;
        const message = await getCardsFromInventory(scryfallIds);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

exports.getCardsFromInventory = getCardsFromInventory;
