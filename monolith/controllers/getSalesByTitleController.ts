require('dotenv').config();
import getSalesFromCardname from '../interactors/getSalesFromCardname';
import Joi from 'joi';
import { validStringRequired } from '../common/validations';
import { JoiValidation, RequestWithUserInfo } from '../common/types';
import { Response } from 'express';

interface GetSaleByTitleQuery {
    cardName: string;
}

const getSalesByTitleController = async (
    req: RequestWithUserInfo,
    res: Response
) => {
    const schema = Joi.object<GetSaleByTitleQuery>({
        cardName: validStringRequired,
    });

    const { error, value }: JoiValidation<GetSaleByTitleQuery> =
        schema.validate(req.query, {
            abortEarly: false,
        });

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const message = await getSalesFromCardname(
            value.cardName,
            req.currentLocation
        );
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

export default getSalesByTitleController;