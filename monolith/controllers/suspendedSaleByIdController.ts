require('dotenv').config();
import getSuspendedSale from '../interactors/getSuspendedSale';
import { RequestWithUserInfo } from '../common/types';
import { Response } from 'express';

const suspendedSaleByIdController = async (
    req: RequestWithUserInfo,
    res: Response
) => {
    const { id } = req.params;

    try {
        const message = await getSuspendedSale(id, req.currentLocation);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
};

export default suspendedSaleByIdController;
