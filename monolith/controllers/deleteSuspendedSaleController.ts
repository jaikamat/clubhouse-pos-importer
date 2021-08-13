require('dotenv').config();
import deleteSuspendedSale from '../interactors/deleteSuspendedSale';
import { RequestWithUserInfo } from '../common/types';
import { Response } from 'express';

const deleteSuspendedSaleController = async (
    req: RequestWithUserInfo,
    res: Response
) => {
    const { id } = req.params;

    try {
        const message = await deleteSuspendedSale(id, req.currentLocation);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
};

export default deleteSuspendedSaleController;
