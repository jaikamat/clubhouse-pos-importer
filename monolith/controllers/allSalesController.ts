require('dotenv').config();
import getAllSales from '../interactors/getAllSales';
import getFormatLegalities from '../interactors/getFormatLegalities';
import { RequestWithUserInfo } from '../common/types';
import { Response } from 'express';

const allSalesController = async (req: RequestWithUserInfo, res: Response) => {
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
