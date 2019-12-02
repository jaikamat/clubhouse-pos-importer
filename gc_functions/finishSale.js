const request = require('request-promise-native');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

function createSaleLine(card) {
    const { price, qtyToSell, finishCondition, name, set_name } = card;

    return `${name} | ${set_name} | Qty sold: ${qtyToSell} | Condition: ${finishCondition} | Price/unit: ${price}`;
}

async function updateCardInventory(card) {
    const { qtyToSell, finishCondition, id, name } = card;
    const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0-uytsf.gcp.mongodb.net/test?retryWrites=true&w=majority`;
    const client = await new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    let status;

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        console.log(
            `Update: QTY: ${qtyToSell}, ${finishCondition}, ${name}, ${id}`
        );

        const db = client.db('test');

        // Upsert the new qtyToSell in the document
        await db.collection('card_inventory').findOneAndUpdate(
            { _id: id },
            {
                $inc: {
                    [`qoh.${finishCondition}`]: -Math.abs(qtyToSell)
                }
            },
            {
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
                _id: id,
                [`qoh.${finishCondition}`]: { $lt: 0 }
            },
            { $set: { [`qoh.${finishCondition}`]: 0 } }
        );

        // Get the updated document for return
        const data = await db.collection('card_inventory').findOne(
            { _id: id },
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

        status = data;
    } catch (err) {
        status = err;
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
        return status;
    }
}

async function createLightspeedSale(authToken, cards) {
    try {
        const url = `https://api.lightspeedapp.com/API/Account/${process.env.LIGHTSPEED_ACCT_ID}/Sale.json`;

        const config = {
            headers: { Authorization: `Bearer ${authToken}` }
        };

        const saleLines = cards.map(card => {
            return { note: createSaleLine(card) };
        });

        const bodyParameters = {
            completed: false,
            SaleLines: {
                SaleLine: saleLines
            }
        };

        return await axios.post(url, bodyParameters, config);
    } catch (err) {
        console.log(err);
    }
}

async function finishSale(cards) {
    try {
        const data = await request.get({
            url: process.env.REFRESH_LIGHTSPEED_AUTH_TOKEN
        });

        const { access_token } = JSON.parse(data);

        // await createLightspeedSale(access_token, cards);

        const dbRes = cards.map(async card => {
            return await updateCardInventory(card);
        });

        return await Promise.all(dbRes);
    } catch (err) {
        console.log(err);
    }
}

exports.finishSale = async (req, res) => {
    // Note: The finishSale function will trigger twice if we do not
    // detect an OPTIONS complex CORS preflight request, which causes errors
    // as the request body is undefined on first execution
    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Headers', '*');
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    }

    try {
        res.set('Access-Control-Allow-Headers', '*');
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'POST');

        const { cards } = req.body;
        const data = await finishSale(cards);
        res.status(200).send(data);
    } catch (err) {
        res.status(400).send(err);
    }
};
