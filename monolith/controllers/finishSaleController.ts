require('dotenv').config();
import finishSale from '../interactors/updateInventoryCards';
import { Controller, ReqWithFinishSaleCards } from '../common/types';

const finishSaleController: Controller<ReqWithFinishSaleCards> = async (
    req,
    res
) => {
    try {
        const { cards } = req.body;
        const { currentLocation, lightspeedEmployeeNumber } = req;

        const data = await finishSale(
            cards,
            currentLocation,
            lightspeedEmployeeNumber
        );

        res.status(200).send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};

export default finishSaleController;
