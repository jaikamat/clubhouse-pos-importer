import express from 'express';
const router = express.Router();
require('dotenv').config();
import getCardsByFilter from '../interactors/getCardsByFilter';
import getDistinctSetNames from '../interactors/getDistinctSetNames';
import getCardsWithInfo from '../interactors/getCardsWithInfo';
import deleteSuspendedSale from '../interactors/deleteSuspendedSale';
import getCardsFromReceiving from '../interactors/getCardsFromReceiving';
import Joi from 'joi';
import {
    validColorSpecificity,
    validDate,
    validFinish,
    validFormatLegalities,
    validFrame,
    validPriceOperator,
    validSort,
    validSortDirection,
    validString,
    validStringRequired,
    validTypeline,
} from '../common/validations';
import {
    ColorSpecificity,
    Finish,
    FormatLegality,
    Frame,
    JoiValidation,
    PriceFilter,
    RequestWithUserInfo,
    SortBy,
    SortByDirection,
    TypeLine,
} from '../common/types';
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

export interface GetCardsByFilterQuery {
    title?: string;
    setName?: string;
    format?: FormatLegality;
    price?: number;
    finish?: Finish;
    colors?: string;
    sortBy?: SortBy;
    colorSpecificity?: ColorSpecificity;
    type?: TypeLine;
    frame?: Frame;
    priceOperator: PriceFilter;
    sortByDirection: SortByDirection;
    page: number;
}

router.get('/getCardsByFilter', async (req: RequestWithUserInfo, res) => {
    const schema = Joi.object<GetCardsByFilterQuery>({
        title: validString,
        setName: validString,
        format: validFormatLegalities,
        price: Joi.number().positive().allow(0),
        finish: validFinish,
        colors: validString,
        sortBy: validSort,
        colorSpecificity: validColorSpecificity,
        type: validTypeline,
        frame: validFrame,
        priceOperator: validPriceOperator,
        sortByDirection: validSortDirection,
        page: Joi.number().integer().min(1).required(),
    });

    const { error, value }: JoiValidation<GetCardsByFilterQuery> =
        schema.validate(req.query, {
            abortEarly: false,
        });

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const { currentLocation } = req;

        const message = await getCardsByFilter(value, currentLocation);

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

interface GetCardsWithInfoQuery {
    title: string;
    matchInStock: boolean;
}

router.get('/getCardsWithInfo', async (req: RequestWithUserInfo, res) => {
    const schema = Joi.object({
        title: validStringRequired,
        matchInStock: Joi.boolean().required(),
    });

    const { error, value }: JoiValidation<GetCardsWithInfoQuery> =
        schema.validate(req.query, {
            abortEarly: false,
        });

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const { title, matchInStock } = value;

        const message = await getCardsWithInfo(
            title,
            matchInStock,
            req.currentLocation
        );
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

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
