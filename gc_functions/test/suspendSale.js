const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const DATABASE_NAME = 'test';
const COLLECTION = 'suspended_sales';
require('dotenv').config();

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

/**
 * Initialize express app and use CORS middleware
 */
const app = express();
app.use(cors());

/**
 * Middleware to check for Bearer token by validating JWT
 */
// app.use((req, res, next) => {
//     let token = req.headers['authorization']; // Express headers converted to lowercase

//     if (token) {
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         try {
//             // Will throw error if validation fails
//             jwt.verify(token, process.env.PRIVATE_KEY);
//             return next();
//         } catch (err) {
//             res.status(401).send('Invalid token');
//         }
//     } else {
//         res.status(401).send('No token present on request');
//     }
// })

/**
 * Returns all suspended sales' ids, customer names, and notes (omitting card lists)
 */
async function getSuspendedSales() {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions)

    try {
        await client.connect();

        const db = client.db(DATABASE_NAME).collection(COLLECTION);

        const docs = await db.find({}, {
            projection: {
                _id: 1,
                createdAt: 1,
                name: 1,
                notes: 1
            }
        });

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
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions)

    try {
        await client.connect();

        const db = client.db(DATABASE_NAME).collection(COLLECTION);
        const doc = await db.findOne({ _id: ObjectID(id) });

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

        const db = client.db(DATABASE_NAME).collection(COLLECTION);

        console.log('Creating new suspended sale');

        // Validate inventory prior to transacting
        const validations = saleList.map(async card => await validateInventory(card));
        await Promise.all(validations);

        // Removes the passed cards from inventory prior to creating
        const dbInserts = saleList.map(async card => await updateCardInventory(card, "DEC"));
        await Promise.all(dbInserts);

        return await db.insertOne({
            createdAt: new Date(),
            name: customerName,
            notes: notes,
            list: saleList
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

        const db = client.db(DATABASE_NAME).collection(COLLECTION);

        console.log(`Deleting suspended sale _id: ${id}`);

        const { list } = await db.findOne({ _id: ObjectID(id) });

        // Adds the passed cards back to inventory prior to deleting
        const dbInserts = list.map(async card => await updateCardInventory(card, "INC"));
        await Promise.all(dbInserts);

        return await db.deleteOne({ _id: ObjectID(id) });
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
            throw new Error(`${name}'s QOH of ${qtyToSell} exceeds inventory of ${quantityOnHand}`);
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
async function updateCardInventory(card, CHANGE_FLAG) {
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

        console.log(`Suspend sale, ${CHANGE_FLAG}: QTY: ${qtyToSell}, ${finishCondition}, ${name}, ${id}`);

        const db = client.db(DATABASE_NAME).collection('card_inventory');

        await db.updateOne(
            { _id: id },
            {
                $inc: {
                    [`qoh.${finishCondition}`]: quantityChange
                }
            }
        );

        // Validate inventory quantites to never be negative numbers
        return await db.updateOne(
            {
                _id: id,
                [`qoh.${finishCondition}`]: { $lt: 0 }
            },
            { $set: { [`qoh.${finishCondition}`]: 0 } }
        );
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

app.get('/', async (req, res) => {
    try {
        const message = await getSuspendedSales();
        res.status(200).send(message)
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
})

app.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const message = await getSuspendedSale(id);
        res.status(200).send(message)
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
})

app.post('/', async (req, res) => {
    const { customerName = '', notes = '', saleList = [] } = req.body;

    try {
        if (customerName.length <= 50 && notes.length <= 150) {
            const message = await createSuspendedSale(customerName, notes, saleList);
            res.status(200).send(message);
        } else {
            res.status(400).send('Inputs were malformed');
        }
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

app.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const message = await deleteSuspendedSale(id);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

exports.suspendSale = app;
