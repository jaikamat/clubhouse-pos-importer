require('dotenv').config();
import { Controller, RequestWithUserInfo } from '../common/types';
import getAllSales from '../interactors/getAllSales';
import getFormatLegalities from '../interactors/getFormatLegalities';

const allSalesController: Controller<RequestWithUserInfo> = async (
    req,
    res
) => {
    try {
        const sales_data = await getAllSales(req.currentLocation);
        const format_legalities = await getFormatLegalities(
            req.currentLocation
        );
        res.status(200).send({ sales_data, format_legalities });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

export default allSalesController;
