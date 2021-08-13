import { NextFunction, Response } from 'express';
require('dotenv').config();
import Joi from 'joi';
import {
    validFinishConditions,
    validInteger,
    validStringRequired,
} from '../common/validations';
import {
    AddCardToInventoryReq,
    AddCardToInventoryReqBody,
    JoiValidation,
} from '../common/types';

/**
 * Request body schema sanitization middleware
 */
const addCardToInventoryValidationController = (
    req: AddCardToInventoryReq,
    res: Response,
    next: NextFunction
) => {
    const schema = Joi.object<AddCardToInventoryReqBody>({
        quantity: validInteger,
        finishCondition: validFinishConditions,
        cardInfo: Joi.object({
            id: validStringRequired,
            name: validStringRequired,
            set_name: validStringRequired,
            set: validStringRequired,
        }).required(),
    });

    const { error }: JoiValidation<AddCardToInventoryReqBody> = schema.validate(
        req.body,
        {
            abortEarly: false,
            allowUnknown: true,
        }
    );

    if (error) {
        return res.status(400).json(error);
    }
    return next();
};

export default addCardToInventoryValidationController;
