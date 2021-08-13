require('dotenv').config();
import getSuspendedSales from '../interactors/getSuspendedSales';
import { RequestWithUserInfo } from '../common/types';
import { Response } from 'express';

const getSuspendedSalesController = async (
    req: RequestWithUserInfo,
    res: Response
) => {
    try {
        const message = await getSuspendedSales(req.currentLocation);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
};

export default getSuspendedSalesController;
