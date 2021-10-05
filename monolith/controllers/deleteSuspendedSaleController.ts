require('dotenv').config();
import { Controller, RequestWithUserInfo } from '../common/types';
import deleteSuspendedSale from '../interactors/deleteSuspendedSale';

const deleteSuspendedSaleController: Controller<RequestWithUserInfo> = async (
    req,
    res
) => {
    const { id } = req.params;

    const message = await deleteSuspendedSale(id, req.currentLocation);
    res.status(200).send(message);
};

export default deleteSuspendedSaleController;
