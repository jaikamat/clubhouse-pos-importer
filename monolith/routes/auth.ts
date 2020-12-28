import express from 'express';
const router = express.Router();
import request from 'request-promise-native';
import axios from 'axios';
import { MongoClient, ObjectID } from 'mongodb';
import jwt from 'jsonwebtoken';
import fetchDbName from '../lib/fetchDbName';
import getCardsByFilter, { Arguments } from '../interactors/getCardsByFilter';
const DATABASE_NAME = fetchDbName();
require('dotenv').config();
import { Request } from 'express';
import { ClubhouseLocation } from '../interactors/getJwt';

interface RequestWithUserInfo extends Request {
    locations: string[];
    currentLocation: ClubhouseLocation;
    isAdmin: boolean;
}

type DecodedToken = {
    locations: string[];
    currentLocation: ClubhouseLocation;
    username: string;
};

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const finishes = [
    'NONFOIL_NM',
    'NONFOIL_LP',
    'NONFOIL_MP',
    'NONFOIL_HP',
    'FOIL_NM',
    'FOIL_LP',
    'FOIL_MP',
    'FOIL_HP',
];

/**
 * Middleware to check for Bearer token by validating JWT
 */
router.use((req: RequestWithUserInfo, res, next) => {
    let token = req.headers['authorization']; // Express headers converted to lowercase

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        try {
            // Will throw error if validation fails
            const { username, locations, currentLocation } = jwt.verify(
                token,
                process.env.PRIVATE_KEY
            ) as DecodedToken;

            // Attach location information to the req and flag admins
            req.locations = locations;
            req.currentLocation = currentLocation;
            req.isAdmin = locations.length === 2;

            return next();
        } catch (err) {
            res.status(401).send('Invalid token');
        }
    } else {
        res.status(401).send('No token present on request');
    }
});

/**
 * Middleware that sanitizes card object properties so nothing funky is committed to the database
 */
router.post('/addCardToInventory', (req: RequestWithUserInfo, res, next) => {
    const { quantity, finishCondition, cardInfo } = req.body;
    const { name, id } = cardInfo;

    if (!id) res.status(400).send(`Card id must be provided`);
    if (!name) res.status(400).send(`Card name must be provided for ${id}`);
    if (typeof quantity !== 'number')
        res.status(400).send(`Card quantity formatted incorrectly for ${name}`);
    if (finishes.indexOf(finishCondition) < 0)
        res.status(400).send(`FinishCondition not a defined type for ${name}`);

    return next();
});

// `finishCondition` Refers to the configuration of Finishes and Conditions ex. NONFOIL_NM or FOIL_LP
async function addCardToInventory({
    quantity,
    finishCondition,
    id,
    name,
    set_name,
    set,
}) {
    try {
        var client = await new MongoClient(
            process.env.MONGO_URI,
            mongoOptions
        ).connect();

        console.log(
            `Update Info: QTY:${quantity}, ${finishCondition}, ${name}, ${id}`
        );

        const db = client.db(DATABASE_NAME).collection('card_inventory');

        // Upsert the new quantity in the document
        await db.updateOne(
            { _id: id },
            {
                $inc: {
                    [`qoh.${finishCondition}`]: quantity,
                },
                $setOnInsert: { name, set_name, set },
            },
            { upsert: true }
        );

        // Validate inventory quantites to never be negative numbers
        await db.updateOne(
            {
                _id: id,
                [`qoh.${finishCondition}`]: { $lt: 0 },
            },
            {
                $set: { [`qoh.${finishCondition}`]: 0 },
            }
        );

        // Get the updated document for return
        return await db.findOne(
            { _id: id },
            {
                projection: {
                    _id: true,
                    qoh: true,
                    name: true,
                    setName: true,
                    set: true,
                },
            }
        );
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}

router.post('/addCardToInventory', async (req: RequestWithUserInfo, res) => {
    try {
        const { quantity, finishCondition, cardInfo } = req.body;
        const { id, name, set_name, set } = cardInfo;
        const message = await addCardToInventory({
            quantity,
            finishCondition,
            id,
            name,
            set_name,
            set,
        });
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

/**
 * Sale middleware that sanitizes card array to ensure inputs are valid. Will throw errors and end sale if needed
 */
router.post('/finishSale', (req: RequestWithUserInfo, res, next) => {
    const { cards } = req.body;

    function sanitizeOne(card) {
        const { price, qtyToSell, finishCondition, name, set_name, id } = card;

        if (!id) throw new Error(`Card property id missing`);
        if (!name && !set_name)
            throw new Error(`Card name or set_name missing for ${id}`);
        if (typeof price !== 'number')
            throw new Error(`Price not number for ${name}`);
        if (price < 0)
            throw new Error(`Price must not be negative for ${name}`);
        if (typeof qtyToSell !== 'number' && qtyToSell % 2 !== 0)
            throw new Error(`qtyToSell formatted incorrectly for ${name}`);
        if (qtyToSell <= 0)
            throw new Error(`qtyToSell must be greater than 0 for ${name}`);
        if (finishes.indexOf(finishCondition) < 0)
            throw new Error(`FinishCondition not a defined type for ${name}`);
        return true;
    }

    try {
        for (let card of cards) {
            sanitizeOne(card);
        }
        return next();
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});

/**
 * Helper fn used to create employee-readable note lines in the Lightspeed POS system
 * @param {Object} card - the card involved in the transaction
 */
function createSaleLine(card) {
    const { price, qtyToSell, finishCondition, name, set_name } = card;

    return `${name} | ${set_name} | Qty sold: ${qtyToSell} | Condition: ${finishCondition} | Price/unit: ${price}`;
}

/**
 * Exposes the DB and passes it down to child queries; wraps the promises
 */
async function updateInventoryCards(cards) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        const db = client.db(DATABASE_NAME);
        const dbInserts = cards.map((card) => updateCardInventory(db, card));

        return await Promise.all(dbInserts); // Persist the inventory changes
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}

/**
 * Updates the Mongo inventory based on the card's passed properties (qtyToSell, finishCondition, id, name)
 * @param {Object} card - the card involved in the transaction
 */
async function updateCardInventory(database, card) {
    const { qtyToSell, finishCondition, id, name } = card;

    try {
        console.log(
            `Update: QTY: ${qtyToSell}, ${finishCondition}, ${name}, ${id}`
        );

        // Upsert the new qtyToSell in the document
        await database.collection('card_inventory').findOneAndUpdate(
            { _id: id },
            {
                $inc: {
                    [`qoh.${finishCondition}`]: -Math.abs(qtyToSell),
                },
            },
            {
                projection: {
                    _id: true,
                    qoh: true,
                    name: true,
                    setName: true,
                    set: true,
                },
                returnOriginal: false,
            }
        );

        // Validate inventory quantites to never be negative numbers
        await database.collection('card_inventory').updateOne(
            {
                _id: id,
                [`qoh.${finishCondition}`]: { $lt: 0 },
            },
            { $set: { [`qoh.${finishCondition}`]: 0 } }
        );

        // Get the updated document for return
        return await database.collection('card_inventory').findOne(
            { _id: id },
            {
                projection: {
                    _id: true,
                    qoh: true,
                    name: true,
                    setName: true,
                    set: true,
                },
            }
        );
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * Creates a sale via the Lightspeed API
 *
 * @param {String} authToken - the store's OAuth access token
 * @param {Array} cards - array of cards involved in the sale
 */
async function createLightspeedSale(authToken, cards) {
    const SHOP_ID = 1; // Retro is the shop; Lance separates by register
    const REGISTER_ID = 2; // Designates The Clubhouse
    const EMPLOYEE_ID = 1;

    try {
        const url = `https://api.lightspeedapp.com/API/Account/${process.env.LIGHTSPEED_ACCT_ID}/Sale.json`;

        const config = {
            headers: { Authorization: `Bearer ${authToken}` },
        };

        const saleLines = cards.map((card) => {
            return {
                Note: { note: createSaleLine(card) },
                taxClassID: 0,
                unitPrice: card.price,
                avgCost: 0,
                fifoCost: 0,
                unitQuantity: card.qtyToSell,
            };
        });

        const bodyParameters = {
            completed: false,
            taxCategoryID: 0,
            employeeID: EMPLOYEE_ID,
            shopID: SHOP_ID,
            registerID: REGISTER_ID,
            SaleLines: {
                SaleLine: saleLines,
            },
        };

        return await axios.post(url, bodyParameters, config);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * Creates a sale persisted to Mongo
 *
 * @param saleData - the data returned by Lightspeed when creating a sale
 * @param cardList - an array of cards that were involved in the sale
 */
async function createSale(saleData, cardList) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();
        console.log(`Creating new sale`);

        const db = client.db(DATABASE_NAME);

        return await db.collection('sales_data').insertOne({
            sale_data: saleData,
            card_list: cardList,
        });
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}

/**
 * Main function that wraps the execution
 * @param {Array} cards - the cards involved in the transaction
 */
async function finishSale(cards) {
    try {
        const res = await request.post({
            url: 'https://cloud.lightspeedapp.com/oauth/access_token.php',
            form: {
                grant_type: process.env.GRANT_TYPE,
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                refresh_token: process.env.REFRESH_TOKEN,
            },
        });

        // Grab the Lightspeed access token from response
        const { access_token } = JSON.parse(res);

        // Create the Lightspeed sale
        const { data } = await createLightspeedSale(access_token, cards);

        // Map updated inserts after successful Lightspeed sale creation
        const dbRes = await updateInventoryCards(cards);

        // Create and persist sale data
        await createSale(data.Sale, cards);

        return {
            cards_upserted: dbRes,
            sale_data: data,
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * Create root POST route
 */
router.post('/finishSale', async (req: RequestWithUserInfo, res) => {
    try {
        const { cards } = req.body;
        const data = await finishSale(cards);
        res.status(200).send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

async function getSales(cardName) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        const db = client.db(DATABASE_NAME);

        // Returns only the relevant queried cards from the card_list array of cards involved in the sale
        // Refer to https://blog.fullstacktraining.com/retrieve-only-queried-element-in-an-object-array-in-mongodb-collection/
        const data = await db.collection('sales_data').aggregate([
            { $match: { 'card_list.name': cardName } },
            {
                $project: {
                    card_list: {
                        $filter: {
                            input: '$card_list',
                            as: 'card_list',
                            cond: { $eq: ['$$card_list.name', cardName] },
                        },
                    },
                    sale_data: 1,
                },
            },
        ]);

        return await data.toArray();
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
    }
}

async function getAllSales() {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);

        const data = await db.collection('sales_data').find({}).project({
            sale_data: 1,
            'sale_data.total': 1,
            'sale_data.saleID': 1,
            'sale_data.timeStamp': 1,
            card_list: 1,
            'card_list.foil': 1,
            'card_list.nonfoil': 1,
            'card_list.id': 1,
            'card_list.name': 1,
            'card_list.set': 1,
            'card_list.set_name': 1,
            'card_list.rarity': 1,
            'card_list.price': 1,
            'card_list.finishCondition': 1,
            'card_list.reserved': 1,
            'card_list.qtyToSell': 1,
            'card_list.card_faces': 1,
        });

        const docs = await data.toArray();

        // Some data, like 'total' and 'price' should be coerced to a Number for ease of use on the frontend
        docs.forEach((el) => {
            el.sale_data.total = Number(el.sale_data.total);

            el.card_list.forEach((el, idx, arr) => {
                arr[idx].price = Number(arr[idx].price);
            });
        });

        return docs;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}

async function getFormatLegalities() {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);

        const agg = []; // Build the aggregation

        // Group by card_list and add the card_list value
        agg.push({
            $group: {
                _id: 0,
                card_list: { $push: '$card_list' },
            },
        });

        // Reduce the card_list group to a new array value by concatenating
        agg.push({
            $project: {
                cards_sold: {
                    $reduce: {
                        input: '$card_list',
                        initialValue: [],
                        in: { $concatArrays: ['$$value', '$$this'] },
                    },
                },
            },
        });

        // Create a new document for each array element in the card_list
        agg.push({
            $unwind: '$cards_sold',
        });

        // Project new fields from the embedded objects within card_list
        agg.push({
            $project: {
                _id: 0,
                id: '$cards_sold._id',
                name: '$cards_sold.name',
                qtyToSell: '$cards_sold.qtyToSell',
                finishCondition: '$cards_sold.finishCondition',
                price: '$cards_sold.price',
            },
        });

        // Create a join on the card ID to get current format legality
        agg.push({
            $lookup: {
                from: 'scryfall_bulk_cards',
                localField: 'id',
                foreignField: 'id',
                as: 'joined_card',
            },
        });

        // Finally, project new fields by adding format_legality and pulling from the $lookup array
        agg.push({
            $project: {
                _id: 0,
                id: 1,
                name: 1,
                qtyToSell: 1,
                finishCondition: 1,
                price: 1,
                legalities: { $arrayElemAt: ['$joined_card.legalities', 0] },
            },
        });

        const data = await db.collection('sales_data').aggregate(agg).toArray();

        data.forEach((el) => {
            el.qtyToSell = parseInt(el.qtyToSell);
        });

        return data;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}

router.get('/allSales', async (req: RequestWithUserInfo, res) => {
    try {
        const sales_data = await getAllSales();
        const format_legalities = await getFormatLegalities();
        res.status(200).send({ sales_data, format_legalities });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/getSaleByTitle', async (req: RequestWithUserInfo, res) => {
    try {
        const { cardName } = req.query;
        const message = await getSales(cardName);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

function validateOne({ id, quantity, finishCondition, name, set, set_name }) {
    if (!id) throw new Error(`Card id must be provided`);
    if (!name) throw new Error(`Card name must be provided for ${id}`);
    if (!set)
        throw new Error(`Card set abbreviation must be provided for ${id}`);
    if (!set_name) throw new Error(`Card set name must be provided for ${id}`);
    if (typeof quantity !== 'number')
        throw new Error(`Card quantity formatted incorrectly for ${name}`);
    if (finishes.indexOf(finishCondition) < 0)
        throw new Error(`FinishCondition not a defined type for ${name}`);
    return;
}

// Wraps the database connection and exposes addCardToInventoryReceiving to the db connection
async function wrapConnectToDb(cards) {
    try {
        var client = await new MongoClient(
            process.env.MONGO_URI,
            mongoOptions
        ).connect();

        console.log('Connected to MongoDB');

        const db = client.db(DATABASE_NAME).collection('card_inventory');

        const promises = cards.map(async (c) =>
            addCardToInventoryReceiving(c, db)
        );

        const messages = await Promise.all(promises);

        return messages;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        console.log('Disconnected from MongoDB');
        await client.close();
    }
}

// `finishCondition` Refers to the configuration of Finishes and Conditions ex. NONFOIL_NM or FOIL_LP
async function addCardToInventoryReceiving(
    { quantity, finishCondition, id, name, set_name, set },
    database
) {
    try {
        console.log(
            `Receiving Info: QTY:${quantity}, ${finishCondition}, ${name}, ${id}`
        );

        // Upsert the new quantity in the document
        return await database.updateOne(
            { _id: id },
            {
                $inc: {
                    [`qoh.${finishCondition}`]: quantity,
                },
                $setOnInsert: { name, set_name, set },
            },
            { upsert: true }
        );
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * Sanitizes card object properties so nothing funky is committed to the database
 */
router.post('/receiveCards', (req: RequestWithUserInfo, res, next) => {
    const { cards } = req.body;

    try {
        for (let card of cards) validateOne(card);
        return next();
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post('/receiveCards', async (req: RequestWithUserInfo, res) => {
    try {
        const { cards } = req.body;
        const messages = await wrapConnectToDb(cards);

        res.status(200).send(messages);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

/**
 * Returns all suspended sales' ids, customer names, and notes (omitting card lists)
 */
async function getSuspendedSales() {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        const db = client.db(DATABASE_NAME).collection('suspended_sales');

        const docs = await db.find(
            {},
            {
                projection: {
                    _id: 1,
                    createdAt: 1,
                    name: 1,
                    notes: 1,
                },
            }
        );

        return await docs.toArray();
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

/**
 * Retrieves one suspended sale
 * @param {string} id
 */
async function getSuspendedSale(id) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        const db = client.db(DATABASE_NAME).collection('suspended_sales');
        const doc = await db.findOne({ _id: new ObjectID(id) });

        return doc;
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

/**
 * Creates a suspended sale. Note that the DB has a TTL index on `createdAt` that wipes documents more than one week old
 * @param {string} customerName - Name of the customer
 * @param {string} notes - Optional notes
 * @param {array} saleList - The array of card objects used on the frontend - translated directly from React state
 */
async function createSuspendedSale(customerName, notes, saleList) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        const db = client.db(DATABASE_NAME).collection('suspended_sales');

        console.log('Creating new suspended sale');

        // Validate inventory prior to transacting
        const validations = saleList.map(
            async (card) => await validateInventory(card)
        );
        await Promise.all(validations);

        // Removes the passed cards from inventory prior to creating
        const dbInserts = saleList.map(
            async (card) => await updateCardInventoryWithFlag(card, 'DEC')
        );
        await Promise.all(dbInserts);

        return await db.insertOne({
            createdAt: new Date(),
            name: customerName,
            notes: notes,
            list: saleList,
        });
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

/**
 * Deletes a single suspended sale
 * @param {string} id
 */
async function deleteSuspendedSale(id) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        const db = client.db(DATABASE_NAME).collection('suspended_sales');

        console.log(`Deleting suspended sale _id: ${id}`);

        const { list } = await db.findOne({ _id: new ObjectID(id) });

        // Adds the passed cards back to inventory prior to deleting
        const dbInserts = list.map(
            async (card) => await updateCardInventoryWithFlag(card, 'INC')
        );
        await Promise.all(dbInserts);

        return await db.deleteOne({ _id: new ObjectID(id) });
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

/**
 * Validates a card's quantity-to-sell against available inventory
 * @param {object} saleListCard properties - the card sent from the frontend with relevant qtyToSell, finishCondition, and id properties attached
 */
async function validateInventory({ qtyToSell, finishCondition, name, id }) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        const db = client.db(DATABASE_NAME).collection('card_inventory');

        const doc = await db.findOne({ _id: id });

        const quantityOnHand = doc.qoh[finishCondition];

        if (parseInt(qtyToSell) > parseInt(quantityOnHand)) {
            throw new Error(
                `${name}'s QOH of ${qtyToSell} exceeds inventory of ${quantityOnHand}`
            );
        }

        return true;
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

/**
 * Updates card inventory based on the card's passed properties (qtyToSell, finishCondition, id, name) and CHANGE_FLAG
 * @param {Object} card - the card involved in the transaction
 * @param {String} CHANGE_FLAG = `INC` or `DEC`, determines whether to increase or decrease quantity, used for reserving inventory in suspension
 */
async function updateCardInventoryWithFlag(card, CHANGE_FLAG) {
    const { qtyToSell, finishCondition, id, name } = card;
    let quantityChange;

    if (CHANGE_FLAG === 'DEC') {
        quantityChange = -Math.abs(qtyToSell);
    } else if (CHANGE_FLAG === 'INC') {
        quantityChange = Math.abs(qtyToSell);
    } else {
        throw new Error('CHANGE_FLAG was not provided');
    }

    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        console.log(
            `Suspend sale, ${CHANGE_FLAG}: QTY: ${qtyToSell}, ${finishCondition}, ${name}, ${id}`
        );

        const db = client.db(DATABASE_NAME).collection('card_inventory');

        await db.updateOne(
            { _id: id },
            {
                $inc: {
                    [`qoh.${finishCondition}`]: quantityChange,
                },
            }
        );

        // Validate inventory quantites to never be negative numbers
        return await db.updateOne(
            {
                _id: id,
                [`qoh.${finishCondition}`]: { $lt: 0 },
            },
            { $set: { [`qoh.${finishCondition}`]: 0 } }
        );
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

router.get('/suspendSale', async (req: RequestWithUserInfo, res) => {
    try {
        const message = await getSuspendedSales();
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

router.get('/suspendSale/:id', async (req: RequestWithUserInfo, res) => {
    const { id } = req.params;

    try {
        const message = await getSuspendedSale(id);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

router.post('/suspendSale', async (req: RequestWithUserInfo, res) => {
    const { customerName = '', notes = '', saleList = [] } = req.body;

    try {
        if (customerName.length <= 50 && notes.length <= 150) {
            const message = await createSuspendedSale(
                customerName,
                notes,
                saleList
            );
            res.status(200).send(message);
        } else {
            res.status(400).send('Inputs were malformed');
        }
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

router.delete('/suspendSale/:id', async (req: RequestWithUserInfo, res) => {
    const { id } = req.params;

    try {
        const message = await deleteSuspendedSale(id);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

router.get('/getCardsByFilter', async (req: RequestWithUserInfo, res) => {
    try {
        const {
            title,
            setName,
            format,
            priceNum,
            priceFilter,
            finish,
            colors,
            sortBy,
            sortByDirection,
            colorSpecificity,
            page,
            type,
            frame,
        }: Partial<Arguments> = req.query;

        const message = await getCardsByFilter({
            title,
            setName,
            format,
            priceNum,
            priceFilter,
            finish,
            colors,
            colorSpecificity,
            sortBy,
            sortByDirection,
            page,
            type,
            frame,
        });

        res.status(200).json(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

export default router;
