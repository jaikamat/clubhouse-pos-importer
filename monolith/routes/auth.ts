import express, { Request } from 'express';
const router = express.Router();
require('dotenv').config();
import jwt from 'jsonwebtoken';
import getCardsByFilter, { Arguments } from '../interactors/getCardsByFilter';
import addCardToInventory from '../interactors/addCardToInventory';
import { ClubhouseLocation } from '../interactors/getJwt';
import getDistinctSetNames from '../interactors/getDistinctSetNames';
import getCardsWithInfo from '../interactors/getCardsWithInfo';
import finishSale from '../interactors/updateInventoryCards';
import getSalesFromCardname from '../interactors/getSalesFromCardname';
import getAllSales from '../interactors/getAllSales';
import getFormatLegalities from '../interactors/getFormatLegalities';
import addCardToInventoryReceiving from '../interactors/addCardToInventoryReceiving';
import getSuspendedSales from '../interactors/getSuspendedSales';
import getSuspendedSale from '../interactors/getSuspendedSale';
import createSuspendedSale from '../interactors/createSuspendedSale';
import deleteSuspendedSale from '../interactors/deleteSuspendedSale';
import addCardsToReceivingRecords from '../interactors/addCardsToReceivingRecords';
import getCardsFromReceiving from '../interactors/getCardsFromReceiving';
import getUserById, { User } from '../interactors/getUserById';
import Joi from 'joi';

interface RequestWithUserInfo extends Request {
    locations: string[];
    currentLocation: ClubhouseLocation;
    isAdmin: boolean;
    lightspeedEmployeeNumber: number;
    userId: string;
}

type DecodedToken = {
    userId: string;
    currentLocation: ClubhouseLocation;
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
 *
 * It attaches current user information to the req for downstream use
 */
router.use(async (req: RequestWithUserInfo, res, next) => {
    let token = req.headers['authorization']; // Express headers converted to lowercase

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        try {
            // Will throw error if validation fails
            const { userId, currentLocation } = jwt.verify(
                token,
                process.env.PRIVATE_KEY
            ) as DecodedToken;

            const user: User = await getUserById(userId);

            // Attach current location information to the req
            // TODO: This should eventually just be a "store id"
            req.currentLocation = currentLocation;

            // Attach user information
            req.userId = userId;
            req.locations = user.locations;
            req.lightspeedEmployeeNumber = user.lightspeedEmployeeNumber;

            // Flag admins
            req.isAdmin = user.locations.length === 2;

            console.log(
                `Operation started by ${user.username} at location ${currentLocation}`
            );

            return next();
        } catch (err) {
            console.log(err);
            res.status(401).send('Invalid token');
        }
    } else {
        res.status(401).send('No token present on request');
    }
});

interface AddCardToInventoryReqBody {
    quantity: number;
    finishCondition: typeof finishes[number];
    cardInfo: {
        id: string;
        name: string;
        set_name: string;
        set: string;
    };
}

interface AddCardToInventoryReq extends RequestWithUserInfo {
    body: AddCardToInventoryReqBody;
}

/**
 * Request body schema sanitization middleware
 */
router.post('/addCardToInventory', (req: AddCardToInventoryReq, res, next) => {
    const schema = Joi.object<AddCardToInventoryReqBody>({
        quantity: Joi.number().integer().required(),
        finishCondition: Joi.string()
            .valid(...finishes)
            .required(),
        cardInfo: Joi.object({
            id: Joi.string().required(),
            name: Joi.string().required(),
            set_name: Joi.string().required(),
            set: Joi.string().required(),
        }).required(),
    });

    const { error } = schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
    });

    if (error) {
        return res.status(400).json(error);
    }
    return next();
});

router.post('/addCardToInventory', async (req: AddCardToInventoryReq, res) => {
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
        const { currentLocation, lightspeedEmployeeNumber } = req;

        const data = await finishSale(
            cards,
            currentLocation,
            lightspeedEmployeeNumber
        );

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

        await addCardsToReceivingRecords(
            cards,
            req.lightspeedEmployeeNumber,
            req.currentLocation,
            req.userId
        );

        res.status(200).send(messages);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

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

// TODO: Ensure we mimic this pattern throughout this file
interface GetReceivedCardsReq extends RequestWithUserInfo {
    query: {
        startDate: string | null;
        endDate: string | null;
        cardName: string | null;
    };
}

router.get('/getReceivedCards', async (req: GetReceivedCardsReq, res) => {
    const { startDate = null, endDate = null, cardName = null } = req.query;

    try {
        const message = await getCardsFromReceiving({
            location: req.currentLocation,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            cardName,
        });

        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

export default router;
