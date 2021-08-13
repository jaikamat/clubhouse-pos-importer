import express from 'express';
const router = express.Router();
require('dotenv').config();
import Joi from 'joi';
import { validStringRequired } from '../common/validations';
import { JoiValidation, RequestWithUserInfo } from '../common/types';
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
import getReceivedCardsController from '../controllers/getReceivedCardsController';
import getReceivedCardsByIdController from '../controllers/getReceivedCardsByIdController';
import salesReportController from '../controllers/salesReportController';

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
router.get('/getReceivedCards', getReceivedCardsController);
router.get('/getReceivedCards/:id', getReceivedCardsByIdController);
router.get('/getSalesReport', salesReportController);

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
