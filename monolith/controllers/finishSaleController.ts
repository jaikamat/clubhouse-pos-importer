require('dotenv').config();
import { Controller, ReqWithFinishSaleCards } from '../common/types';
import finishSale from '../interactors/updateInventoryCards';

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
        res.status(500).json(err);
    }
};

export default finishSaleController;
