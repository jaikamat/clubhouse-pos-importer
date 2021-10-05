require('dotenv').config();
import { Controller, ReqWithFinishSaleCards } from '../common/types';
import finishSale from '../interactors/updateInventoryCards';

const finishSaleController: Controller<ReqWithFinishSaleCards> = async (
    req,
    res
) => {
    const { cards } = req.body;
    const { currentLocation, lightspeedEmployeeNumber } = req;

    const data = await finishSale(
        cards,
        currentLocation,
        lightspeedEmployeeNumber
    );

    res.status(200).send(data);
};

export default finishSaleController;
