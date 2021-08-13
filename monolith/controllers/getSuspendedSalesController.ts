require('dotenv').config();
import getSuspendedSales from '../interactors/getSuspendedSales';
import { Controller, RequestWithUserInfo } from '../common/types';

const getSuspendedSalesController: Controller<RequestWithUserInfo> = async (
    req,
    res
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
