const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

// 'TYPE' Refers to the configuration of Finishes and Conditions
async function addCardToInventory(quantity, type, cardInfo) {
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

        message = await db.collection('card_inventory').findOneAndUpdate(
            { _id: cardInfo.id },
            {
                $inc: {
                    [`qoh.${type}`]: quantity
                },
                $setOnInsert: cardInfo
            },
            {
                upsert: true
            }
        );

        status = 'Card successfully added to database';
    } catch (err) {
        status = err;
    } finally {
        await client.close();
        return status;
    }
}

exports.addCardToInventory = async (req, res) => {
    res.set('Access-Control-Allow-Headers', '*');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');

    try {
        const { quantity, type, cardInfo } = req.body;
        const message = await addCardToInventory(quantity, type, cardInfo);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

exports.addCardToInventory = addCardToInventory;
