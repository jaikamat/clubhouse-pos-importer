require('dotenv').config();
import Joi from 'joi';
import { validStringRequired } from '../common/validations';
import { JoiValidation, RequestWithUserInfo } from '../common/types';
import getCardPrintings from '../interactors/getCardPrintings';
import { Response } from 'express';

interface BulkSearchQuery {
    cardName: string;
}

const bulkSearchController = async (
    req: RequestWithUserInfo,
    res: Response
) => {
    const schema = Joi.object<BulkSearchQuery>({
        cardName: validStringRequired,
    });

    const { error, value }: JoiValidation<BulkSearchQuery> = schema.validate(
        req.query,
        { abortEarly: false }
    );

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const cards = await getCardPrintings(value.cardName);
        res.status(200).json(cards);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
};

export default bulkSearchController;
