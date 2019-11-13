const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
require('dotenv').config();

async function addCardToInventory(data) {
    const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0-uytsf.gcp.mongodb.net/test?retryWrites=true&w=majority`;
    const client = await new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        const db = client.db('test');

        let d = await db
            .collection('card_inventory')
            .insertOne({ hello: 'world' });

        // get item
        // if no item, create item
        // _id = scryfallId and

        assert.equal(1, d.insertedCount);
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

exports.writeCardDataToDB = async (req, res) => {
    try {
        await writeData(req.body);
        res.status(200).send('DB was updated');
    } catch (e) {
        console.log(e);
        res.status(500).send('Server error');
    }
};

exports.addCardToInventory = addCardToInventory;
