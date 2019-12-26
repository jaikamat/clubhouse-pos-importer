const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

async function inventorySearchQuery(
    sort = 'name',
    skip = 0,
    colorIdentity = []
) {
    const client = await new MongoClient(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    let status;

    // TODO: Set default for type line

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        const db = client.db('test');

        const data = await db
            .collection('card_inventory')
            .find({
                // color_identity: { $in: colorIdentity }
            })
            .sort({ [sort]: 1 })
            .skip(skip)
            .limit(100);

        const documents = await data.toArray();

        status = documents;
    } catch (err) {
        status = err;
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
        return status;
    }
}

exports.inventorySearchQuery = async (req, res) => {
    res.set('Access-Control-Allow-Headers', '*');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');

    try {
        const { sort, skip, colorIdentity } = req.body;
        const message = await inventorySearchQuery(sort, skip, colorIdentity);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

exports.inventorySearchQuery = inventorySearchQuery;
