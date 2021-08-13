import { Response } from 'express';
require('dotenv').config();
import addCardToInventory from '../interactors/addCardToInventory';
import { AddCardToInventoryReq } from '../common/types';

const addCardToInventoryController = async (
    req: AddCardToInventoryReq,
    res: Response
) => {
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
};

export default addCardToInventoryController;
