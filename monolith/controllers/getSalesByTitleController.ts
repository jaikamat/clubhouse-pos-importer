require('dotenv').config();
import Joi from 'joi';
import {
    Controller,
    JoiValidation,
    RequestWithUserInfo,
} from '../common/types';
import { validStringRequired } from '../common/validations';
import getSalesFromCardname from '../interactors/getSalesFromCardname';

interface GetSaleByTitleQuery {
    cardName: string;
}

const getSalesByTitleController: Controller<RequestWithUserInfo> = async (
    req,
    res
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
        res.status(500).json(err);
    }
};

export default getSalesByTitleController;
