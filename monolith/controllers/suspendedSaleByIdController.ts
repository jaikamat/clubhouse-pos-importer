require('dotenv').config();
import { Controller, RequestWithUserInfo } from '../common/types';
import getSuspendedSale from '../interactors/getSuspendedSale';

const suspendedSaleByIdController: Controller<RequestWithUserInfo> = async (
    req,
    res
) => {
    const { id } = req.params;

    try {
        const message = await getSuspendedSale(id, req.currentLocation);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).json(err);
    }
};

export default suspendedSaleByIdController;
