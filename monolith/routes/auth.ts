import express from 'express';
const router = express.Router();
require('dotenv').config();
import jwt from 'jsonwebtoken';
import getCardsByFilter, { Arguments } from '../interactors/getCardsByFilter';
import addCardToInventory from '../interactors/addCardToInventory';
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
import {
    AddCardToInventoryReq,
    AddCardToInventoryReqBody,
    DecodedToken,
    finishes,
    FinishSaleCard,
    ReceivedCardQuery,
    ReceivingCard,
    RequestWithUserInfo,
    ReqWithFinishSaleCards,
    ReqWithReceivingCards,
    ReqWithSuspendSale,
    SuspendSaleBody,
    Trade,
} from '../common/types';

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
router.post('/finishSale', (req: ReqWithFinishSaleCards, res, next) => {
    const schema = Joi.object<FinishSaleCard>({
        id: Joi.string().required(),
        price: Joi.number().min(0).required(),
        qtyToSell: Joi.number().integer().required(),
        name: Joi.string().required(),
        set_name: Joi.string().required(),
        finishCondition: Joi.string()
            .valid(...finishes)
            .required(),
    });

    const { cards } = req.body;

    try {
        for (let card of cards) {
            const { error } = schema.validate(card, {
                abortEarly: false,
                allowUnknown: true,
            });

            if (error) {
                return res.status(400).json(error);
            }
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
router.post('/finishSale', async (req: ReqWithFinishSaleCards, res) => {
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

/**
 * Sanitizes card object properties so nothing funky is committed to the database
 */
router.post('/receiveCards', (req: ReqWithReceivingCards, res, next) => {
    const schema = Joi.object<ReceivingCard>({
        id: Joi.string().required(),
        quantity: Joi.number().integer().required(),
        name: Joi.string().required(),
        set_name: Joi.string().required(),
        finishCondition: Joi.string()
            .valid(...finishes)
            .required(),
        set: Joi.string().required(),
        creditPrice: Joi.number().min(0).required(),
        cashPrice: Joi.number().min(0).required(),
        marketPrice: Joi.number().min(0).required(),
        tradeType: Joi.string().valid(Trade.Cash, Trade.Credit).required(),
    });

    const { cards } = req.body;

    try {
        for (let card of cards) {
            const { error } = schema.validate(card, {
                abortEarly: false,
                allowUnknown: true,
            });

            if (error) {
                return res.status(400).json(error);
            }
        }

        return next();
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post('/receiveCards', async (req: ReqWithReceivingCards, res) => {
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

router.post('/suspendSale', async (req: ReqWithSuspendSale, res) => {
    const schema = Joi.object<SuspendSaleBody>({
        customerName: Joi.string().min(3).max(100).required(),
        notes: Joi.string().min(0).max(255).allow(''),
        saleList: Joi.array().items(
            Joi.object<FinishSaleCard>({
                id: Joi.string().required(),
                price: Joi.number().min(0).required(),
                qtyToSell: Joi.number().integer().required(),
                name: Joi.string().required(),
                set_name: Joi.string().required(),
                finishCondition: Joi.string()
                    .valid(...finishes)
                    .required(),
            })
        ),
    });

    const { customerName = '', notes = '', saleList = [] } = req.body;

    const { error } = schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
    });

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const message = await createSuspendedSale(
            customerName,
            notes,
            saleList,
            req.currentLocation
        );
        res.status(200).send(message);
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

router.get('/getReceivedCards', async (req: RequestWithUserInfo, res) => {
    const schema = Joi.object<ReceivedCardQuery>({
        startDate: Joi.date().iso().allow(null),
        endDate: Joi.date().iso().allow(null),
        cardName: Joi.string().allow(null),
    });

    const { error, value }: { error?: Error; value: ReceivedCardQuery } =
        schema.validate(req.query, {
            abortEarly: false,
        });

    if (error) {
        return res.status(400).json(error);
    }

    const { startDate, endDate, cardName } = value;

    try {
        const message = await getCardsFromReceiving({
            location: req.currentLocation,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            cardName: cardName || null,
        });

        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

export default router;
