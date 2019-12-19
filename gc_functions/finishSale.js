const request = require('request-promise-native');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

/**
 * Helper fn used to create employee-readable note lines in the Lightspeed POS system
 * @param {Object} card - the card involved in the transaction
 */
function createSaleLine(card) {
    const { price, qtyToSell, finishCondition, name, set_name } = card;

    return `${name} | ${set_name} | Qty sold: ${qtyToSell} | Condition: ${finishCondition} | Price/unit: ${price}`;
}

/**
 * Updates the Mongo inventory based on the card's passed properties (qtyToSell, finishCondition, id, name)
 * @param {Object} card - the card involved in the transaction
 */
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

/**
 * Creates a sale via the Lightspeed API
 *
 * @param {String} authToken - the store's OAuth access token
 * @param {Array} cards - array of cards involved in the sale
 */
async function createLightspeedSale(authToken, cards) {
    try {
        const url = `https://api.lightspeedapp.com/API/Account/${process.env.LIGHTSPEED_ACCT_ID}/Sale.json`;

        const config = {
            headers: { Authorization: `Bearer ${authToken}` }
        };

        const saleLines = cards.map(card => {
            return {
                Note: { note: createSaleLine(card) },
                taxClassID: 0,
                unitPrice: card.price,
                avgCost: 0,
                fifoCost: 0,
                unitQuantity: card.qtyToSell
            };
        });

        const bodyParameters = {
            completed: false,
            taxCategoryID: 0,
            employeeID: 1,
            shopID: 1, // Retro is the shop; Lance separates by register
            registerID: 2, // Designates The Clubhouse
            SaleLines: {
                SaleLine: saleLines
            }
        };

        return await axios.post(url, bodyParameters, config);
    } catch (err) {
        console.log(err);
    }
}

/**
 * Creates a sale persisted to Mongo
 *
 * @param saleData - the data returned by Lightspeed when creating a sale
 * @param cardList - an array of cards that were involved in the sale
 */
async function createSale(saleData, cardList) {
    const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0-uytsf.gcp.mongodb.net/test?retryWrites=true&w=majority`;
    const client = await new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    let status;

    try {
        await client.connect();
        console.log('Successfully connected to mongo');
        console.log(`Creating new sale`);

        const db = client.db('test');

        const data = await db.collection('sales_data').insertOne({
            sale_data: saleData,
            card_list: cardList
        });

        status = data;
    } catch (err) {
        status = err;
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
        return status;
    }
}

/**
 * Main function that wraps the execution
 * @param {Array} cards - the cards involved in the transaction
 */
async function finishSale(cards) {
    try {
        const token = await request.get({
            url: process.env.REFRESH_LIGHTSPEED_AUTH_TOKEN
        });

        // Grab the Lightspeed access token from response
        const { access_token } = JSON.parse(token);

        // Create the Lightspeed sale
        const { data } = await createLightspeedSale(access_token, cards);

        // Map updated inserts after successful Lightspeed sale creation
        const dbInserts = cards.map(async card => {
            return await updateCardInventory(card);
        });

        // Persist the inventory changes
        const dbRes = await Promise.all(dbInserts);

        // Create and persist sale data
        await createSale(data.Sale, cards);

        return {
            cards_upserted: dbRes,
            sale_data: data
        };
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
