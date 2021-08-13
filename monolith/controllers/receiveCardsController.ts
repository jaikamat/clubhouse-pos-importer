require('dotenv').config();
import addCardToInventoryReceiving from '../interactors/addCardToInventoryReceiving';
import addCardsToReceivingRecords from '../interactors/addCardsToReceivingRecords';
import { Controller, ReqWithReceivingCards } from '../common/types';

const receiveCardsController: Controller<ReqWithReceivingCards> = async (
    req,
    res
) => {
    try {
        const { cards, customerName, customerContact } = req.body;
        const messages = await addCardToInventoryReceiving(
            cards,
            req.currentLocation
        );

        await addCardsToReceivingRecords({
            cards,
            employeeNumber: req.lightspeedEmployeeNumber,
            location: req.currentLocation,
            userId: req.userId,
            customerName,
            customerContact,
        });

        res.status(200).send(messages);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

export default receiveCardsController;
