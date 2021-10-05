require('dotenv').config();
import { Controller, RequestWithUserInfo } from '../common/types';
import deleteSuspendedSale from '../interactors/deleteSuspendedSale';

const deleteSuspendedSaleController: Controller<RequestWithUserInfo> = async (
    req,
    res
) => {
    const { id } = req.params;

    try {
        const message = await deleteSuspendedSale(id, req.currentLocation);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).json(err);
    }
};

export default deleteSuspendedSaleController;
