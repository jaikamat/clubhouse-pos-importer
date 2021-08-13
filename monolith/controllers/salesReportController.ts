require('dotenv').config();
import Joi from 'joi';
import { validDate } from '../common/validations';
import { JoiValidation, RequestWithUserInfo } from '../common/types';
import moment from 'moment';
import getSalesReport from '../interactors/getSalesReport';
import { Response } from 'express';

interface SalesReportQuery {
    startDate: string | null;
    endDate: string | null;
}

const salesReportController = async (
    req: RequestWithUserInfo,
    res: Response
) => {
    const schema = Joi.object<SalesReportQuery>({
        startDate: validDate,
        endDate: validDate,
    });

    const { error, value }: JoiValidation<SalesReportQuery> = schema.validate(
        req.query,
        { abortEarly: false }
    );

    if (error) {
        return res.status(400).json(error);
    }

    const { startDate, endDate } = value;

    try {
        const message = await getSalesReport({
            location: req.currentLocation,
            startDate: moment(startDate).utc().startOf('day').toDate(),
            endDate: moment(endDate).utc().startOf('day').toDate(),
        });

        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
};

export default salesReportController;
