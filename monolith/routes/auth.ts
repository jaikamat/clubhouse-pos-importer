import express from 'express';
const router = express.Router();
require('dotenv').config();
import getCardsFromReceiving from '../interactors/getCardsFromReceiving';
import Joi from 'joi';
import {
    validDate,
    validString,
    validStringRequired,
} from '../common/validations';
import { JoiValidation, RequestWithUserInfo } from '../common/types';
import moment from 'moment';
import getReceivingById from '../interactors/getReceivingById';
import getSalesReport from '../interactors/getSalesReport';
import getCardPrintings from '../interactors/getCardPrintings';
import authController from '../controllers/authController';
import addCardToInventoryValidationController from '../controllers/addCardToInventoryValidationController';
import addCardToInventoryController from '../controllers/addCardToInventoryController';
import finishSaleValidationController from '../controllers/finishSaleValidationController';
import finishSaleController from '../controllers/finishSaleController';
import allSalesController from '../controllers/allSalesController';
import getSalesByTitleController from '../controllers/getSalesByTitleController';
import receiveCardsValidationController from '../controllers/receiveCardsValidationController';
import receiveCardsController from '../controllers/receiveCardsController';
import getSuspendedSalesController from '../controllers/getSuspendedSalesController';
import suspendedSaleByIdController from '../controllers/suspendedSaleByIdController';
import createSuspendedSaleController from '../controllers/createSuspendedSaleController';
import deleteSuspendedSaleController from '../controllers/deleteSuspendedSaleController';
import getCardsByFilterController from '../controllers/getCardsByFilterController';
import distinctSetNamesController from '../controllers/distinctSetNamesController';
import getCardsWithInfoController from '../controllers/getCardsWithInfoController';

router.use(authController);
router.post('/addCardToInventory', addCardToInventoryValidationController);
router.post('/addCardToInventory', addCardToInventoryController);
router.post('/finishSale', finishSaleValidationController);
router.post('/finishSale', finishSaleController);
router.get('/allSales', allSalesController);
router.get('/getSaleByTitle', getSalesByTitleController);
router.post('/receiveCards', receiveCardsValidationController);
router.post('/receiveCards', receiveCardsController);
router.get('/suspendSale', getSuspendedSalesController);
router.get('/suspendSale/:id', suspendedSaleByIdController);
router.post('/suspendSale', createSuspendedSaleController);
router.delete('/suspendSale/:id', deleteSuspendedSaleController);
router.get('/getCardsByFilter', getCardsByFilterController);
router.get('/getDistinctSetNames', distinctSetNamesController);
router.get('/getCardsWithInfo', getCardsWithInfoController);

interface ReceivedCardQuery {
    startDate: string | null;
    endDate: string | null;
    cardName: string | null;
}

router.get('/getReceivedCards', async (req: RequestWithUserInfo, res) => {
    const schema = Joi.object<ReceivedCardQuery>({
        startDate: validDate,
        endDate: validDate,
        cardName: validString.allow(null),
    });

    const { error, value }: JoiValidation<ReceivedCardQuery> = schema.validate(
        req.query,
        {
            abortEarly: false,
        }
    );

    if (error) {
        return res.status(400).json(error);
    }

    const { startDate, endDate, cardName } = value;

    try {
        const message = await getCardsFromReceiving({
            location: req.currentLocation,
            startDate: moment(startDate).utc().startOf('day').toDate(),
            endDate: moment(endDate).utc().endOf('day').toDate(),
            cardName: cardName || null,
        });

        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/getReceivedCards/:id', async (req: RequestWithUserInfo, res) => {
    const { id } = req.params;

    try {
        const message = await getReceivingById(id, req.currentLocation);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

interface SalesReportQuery {
    startDate: string | null;
    endDate: string | null;
}

router.get('/getSalesReport', async (req: RequestWithUserInfo, res) => {
    const schema = Joi.object<SalesReportQuery>({
        startDate: validDate,
        endDate: validDate,
    });

    const { error, value }: JoiValidation<SalesReportQuery> = schema.validate(
        req.query,
        { abortEarly: false }
    );

    if (error) {
        return res.status(400).json(error);
    }

    const { startDate, endDate } = value;

    try {
        const message = await getSalesReport({
            location: req.currentLocation,
            startDate: moment(startDate).utc().startOf('day').toDate(),
            endDate: moment(endDate).utc().startOf('day').toDate(),
        });

        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

interface BulkSearchQuery {
    cardName: string;
}

router.get('/bulkSearch', async (req: RequestWithUserInfo, res) => {
    const schema = Joi.object<BulkSearchQuery>({
        cardName: validStringRequired,
    });

    const { error, value }: JoiValidation<BulkSearchQuery> = schema.validate(
        req.query,
        { abortEarly: false }
    );

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const cards = await getCardPrintings(value.cardName);
        res.status(200).json(cards);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

export default router;
