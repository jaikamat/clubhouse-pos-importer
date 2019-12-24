const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

// 'TYPE' Refers to the configuration of Finishes and Conditions
async function addCardToInventory(quantity, type, cardInfo) {
    const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0-uytsf.gcp.mongodb.net/test?retryWrites=true&w=majority`;
    const client = await new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        console.log(
            `Update Info: QTY:${quantity}, ${type}, ${cardInfo.name}, ${cardInfo.id}`
        );

        const db = client.db('test');

        // Upsert the new quantity in the document
        await db.collection('card_inventory').findOneAndUpdate(
            { _id: cardInfo.id },
            {
                $inc: {
                    [`qoh.${type}`]: quantity
                },
                $setOnInsert: cardInfo
            },
            {
                upsert: true,
                projection: {
                    _id: true,
                    qoh: true,
                    name: true,
                    setName: true,
                    set: true
                },
                returnOriginal: false
            }
        );

        // Validate inventory quantites to never be negative numbers
        await db.collection('card_inventory').updateOne(
            {
                _id: cardInfo.id,
                [`qoh.${type}`]: { $lt: 0 }
            },
            { $set: { [`qoh.${type}`]: 0 } }
        );

        // Get the updated document for return
        return await db.collection('card_inventory').findOne(
            { _id: cardInfo.id },
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
    } catch (err) {
        console.log(err);
        return err;
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
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
