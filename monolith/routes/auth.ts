import express from 'express';
const router = express.Router();
import { MongoClient, ObjectID } from 'mongodb';
import jwt from 'jsonwebtoken';
import fetchDbName from '../lib/fetchDbName';
const DATABASE_NAME = fetchDbName();
import getCardsByFilter, { Arguments } from '../interactors/getCardsByFilter';
import addCardToInventory from '../interactors/addCardToInventory';
require('dotenv').config();
import { Request } from 'express';
import { ClubhouseLocation } from '../interactors/getJwt';
import getDistinctSetNames from '../interactors/getDistinctSetNames';
import collectionFromLocation from '../lib/collectionFromLocation';
import getCardsWithInfo from '../interactors/getCardsWithInfo';
import finishSale from '../interactors/updateInventoryCards';
import getSalesFromCardname from '../interactors/getSalesFromCardname';
import getAllSales from '../interactors/getAllSales';
import getFormatLegalities from '../interactors/getFormatLegalities';
import addCardToInventoryReceiving from '../interactors/addCardToInventoryReceiving';

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
] as const;

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

router.post('/addCardToInventory', async (req: RequestWithUserInfo, res) => {
    try {
        const { quantity, finishCondition, cardInfo } = req.body;
        const { currentLocation: location } = req;
        const { id, name, set_name, set } = cardInfo;
        const message = await addCardToInventory({
            quantity,
            finishCondition,
            id,
            name,
            set_name,
            set,
            location,
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
 * Create root POST route
 */
router.post('/finishSale', async (req: RequestWithUserInfo, res) => {
    try {
        const { cards } = req.body;
        const data = await finishSale(cards, req.currentLocation);
        res.status(200).send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

router.get('/allSales', async (req: RequestWithUserInfo, res) => {
    try {
        const sales_data = await getAllSales(req.currentLocation);
        const format_legalities = await getFormatLegalities(
            req.currentLocation
        );
        res.status(200).send({ sales_data, format_legalities });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/getSaleByTitle', async (req: RequestWithUserInfo, res) => {
    try {
        const { cardName } = req.query;
        const message = await getSalesFromCardname(
            cardName,
            req.currentLocation
        );
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
        const messages = await addCardToInventoryReceiving(
            cards,
            req.currentLocation
        );

        res.status(200).send(messages);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

/**
 * Returns all suspended sales' ids, customer names, and notes (omitting card lists)
 */
async function getSuspendedSales(location: ClubhouseLocation) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        const db = client
            .db(DATABASE_NAME)
            .collection(collectionFromLocation(location).suspendedSales);

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
async function getSuspendedSale(id, location) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        const db = client
            .db(DATABASE_NAME)
            .collection(collectionFromLocation(location).suspendedSales);
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
async function createSuspendedSale(
    customerName,
    notes,
    saleList,
    location: ClubhouseLocation
) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        const db = client
            .db(DATABASE_NAME)
            .collection(collectionFromLocation(location).suspendedSales);

        console.log('Creating new suspended sale');

        // Validate inventory prior to transacting
        const validations = saleList.map(
            async (card) => await validateInventory(card, location)
        );
        await Promise.all(validations);

        // Removes the passed cards from inventory prior to creating
        const dbInserts = saleList.map(
            async (card) =>
                await updateCardInventoryWithFlag(card, 'DEC', location)
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
async function deleteSuspendedSale(id, location) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        const db = client
            .db(DATABASE_NAME)
            .collection(collectionFromLocation(location).suspendedSales);

        console.log(`Deleting suspended sale _id: ${id}`);

        const { list } = await db.findOne({ _id: new ObjectID(id) });

        // Adds the passed cards back to inventory prior to deleting
        const dbInserts = list.map(
            async (card) =>
                await updateCardInventoryWithFlag(card, 'INC', location)
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
async function validateInventory(
    { qtyToSell, finishCondition, name, id },
    location: ClubhouseLocation
) {
    const client = await new MongoClient(process.env.MONGO_URI, mongoOptions);

    try {
        await client.connect();

        const db = client
            .db(DATABASE_NAME)
            .collection(collectionFromLocation(location).cardInventory);

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
async function updateCardInventoryWithFlag(
    card,
    CHANGE_FLAG,
    location: ClubhouseLocation
) {
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

        const db = client
            .db(DATABASE_NAME)
            .collection(collectionFromLocation(location).cardInventory);

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
        const message = await getSuspendedSales(req.currentLocation);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

router.get('/suspendSale/:id', async (req: RequestWithUserInfo, res) => {
    const { id } = req.params;

    try {
        const message = await getSuspendedSale(id, req.currentLocation);
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
                saleList,
                req.currentLocation
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
        const message = await deleteSuspendedSale(id, req.currentLocation);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

router.get('/getCardsByFilter', async (req: RequestWithUserInfo, res) => {
    try {
        const { currentLocation: location } = req;
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
            location,
        });

        res.status(200).json(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/getDistinctSetNames', async (req: RequestWithUserInfo, res) => {
    try {
        const names = await getDistinctSetNames(req.currentLocation);
        res.status(200).send(names);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/getCardsWithInfo', async (req: RequestWithUserInfo, res) => {
    try {
        const { title, matchInStock } = req.query;
        const myMatch = matchInStock === 'true';

        if (typeof title === 'string') {
            const message = await getCardsWithInfo(
                title,
                myMatch,
                req.currentLocation
            );
            res.status(200).send(message);
        } else {
            throw new Error('title should be a string');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

export default router;
