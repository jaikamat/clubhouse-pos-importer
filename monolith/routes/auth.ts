require('dotenv').config();
import express from 'express';
import {
    addCardToInventoryController,
    allSalesController,
    authController,
    bulkSearchController,
    createSuspendedSaleController,
    deleteSuspendedSaleController,
    distinctSetNamesController,
    finishSaleController,
    finishSaleValidationController,
    getCardsByFilterController,
    getCardsWithInfoController,
    getReceivedCardsByIdController,
    getReceivedCardsController,
    getSalesByTitleController,
    getSuspendedSalesController,
    receiveCardsController,
    receiveCardsValidationController,
    salesReportController,
    suspendedSaleByIdController,
} from '../controllers';
const router = express.Router();

router.use(authController);
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
router.get('/bulkSearch', bulkSearchController);

export default router;
