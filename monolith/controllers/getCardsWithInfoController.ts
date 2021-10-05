require('dotenv').config();
import Joi from 'joi';
import {
    Controller,
    JoiValidation,
    RequestWithUserInfo,
} from '../common/types';
import { validStringRequired } from '../common/validations';
import getCardsWithInfo from '../interactors/getCardsWithInfo';

interface GetCardsWithInfoQuery {
    title: string;
    matchInStock: boolean;
}

const getCardsWithInfoController: Controller<RequestWithUserInfo> = async (
    req,
    res
) => {
    const schema = Joi.object({
        title: validStringRequired,
        matchInStock: Joi.boolean().required(),
    });

    const { error, value }: JoiValidation<GetCardsWithInfoQuery> =
        schema.validate(req.query, {
            abortEarly: false,
        });

    if (error) {
        return res.status(400).json(error);
    }

    const { title, matchInStock } = value;

    const message = await getCardsWithInfo(
        title,
        matchInStock,
        req.currentLocation
    );
    res.status(200).send(message);
};

export default getCardsWithInfoController;
