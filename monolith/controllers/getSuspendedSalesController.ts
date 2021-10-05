require('dotenv').config();
import { Controller, RequestWithUserInfo } from '../common/types';
import getSuspendedSales from '../interactors/getSuspendedSales';

const getSuspendedSalesController: Controller<RequestWithUserInfo> = async (
    req,
    res
) => {
    try {
        const message = await getSuspendedSales(req.currentLocation);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).json(err);
    }
};

export default getSuspendedSalesController;
