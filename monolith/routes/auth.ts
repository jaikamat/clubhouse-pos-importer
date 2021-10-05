require('dotenv').config();
import express from 'express';
import {
    addCardToInventoryController,
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
import errorBoundary from '../controllers/errorBoundary';
const router = express.Router();

router.use(authController);
router.post('/addCardToInventory', errorBoundary(addCardToInventoryController));
router.post('/finishSale', errorBoundary(finishSaleValidationController));
router.post('/finishSale', errorBoundary(finishSaleController));
router.get('/getSaleByTitle', errorBoundary(getSalesByTitleController));
router.post('/receiveCards', errorBoundary(receiveCardsValidationController));
router.post('/receiveCards', errorBoundary(receiveCardsController));
router.get('/suspendSale', errorBoundary(getSuspendedSalesController));
router.get('/suspendSale/:id', errorBoundary(suspendedSaleByIdController));
router.post('/suspendSale', errorBoundary(createSuspendedSaleController));
router.delete('/suspendSale/:id', errorBoundary(deleteSuspendedSaleController));
router.get('/getCardsByFilter', errorBoundary(getCardsByFilterController));
router.get('/getDistinctSetNames', errorBoundary(distinctSetNamesController));
router.get('/getCardsWithInfo', errorBoundary(getCardsWithInfoController));
router.get('/getReceivedCards', errorBoundary(getReceivedCardsController));
router.get(
    '/getReceivedCards/:id',
    errorBoundary(getReceivedCardsByIdController)
);
router.get('/getSalesReport', errorBoundary(salesReportController));
router.get('/bulkSearch', errorBoundary(bulkSearchController));

export default router;
