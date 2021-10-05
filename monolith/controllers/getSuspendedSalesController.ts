require('dotenv').config();
import { Controller, RequestWithUserInfo } from '../common/types';
import getSuspendedSales from '../interactors/getSuspendedSales';

const getSuspendedSalesController: Controller<RequestWithUserInfo> = async (
    req,
    res
) => {
    const message = await getSuspendedSales(req.currentLocation);
    res.status(200).send(message);
};

export default getSuspendedSalesController;
