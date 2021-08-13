require('dotenv').config();
import getCardsWithInfo from '../interactors/getCardsWithInfo';
import Joi from 'joi';
import { validStringRequired } from '../common/validations';
import { JoiValidation, RequestWithUserInfo } from '../common/types';
import { Response } from 'express';

interface GetCardsWithInfoQuery {
    title: string;
    matchInStock: boolean;
}

const getCardsWithInfoController = async (
    req: RequestWithUserInfo,
    res: Response
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

    try {
        const { title, matchInStock } = value;

        const message = await getCardsWithInfo(
            title,
            matchInStock,
            req.currentLocation
        );
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

export default getCardsWithInfoController;
