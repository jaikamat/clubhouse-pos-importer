require('dotenv').config();
import Joi from 'joi';
import {
    Controller,
    JoiValidation,
    RequestWithUserInfo,
} from '../common/types';
import { validStringRequired } from '../common/validations';
import getCardPrintings from '../interactors/getCardPrintings';

interface BulkSearchQuery {
    cardName: string;
}

const bulkSearchController: Controller<RequestWithUserInfo> = async (
    req,
    res
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
        res.status(500).json(err);
    }
};

export default bulkSearchController;
