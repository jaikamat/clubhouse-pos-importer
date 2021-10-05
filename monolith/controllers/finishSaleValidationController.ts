require('dotenv').config();
import Joi from 'joi';
import {
    Controller,
    FinishSaleCard,
    JoiValidation,
    ReqWithFinishSaleCards,
} from '../common/types';
import {
    validFinishConditions,
    validInteger,
    validPrice,
    validStringRequired,
} from '../common/validations';

/**
 * Sale middleware that sanitizes card array to ensure inputs are valid. Will throw errors and end sale if needed
 */
const finishSaleValidationController: Controller<ReqWithFinishSaleCards> = (
    req,
    res,
    next
) => {
    const schema = Joi.object<FinishSaleCard>({
        id: validStringRequired,
        price: validPrice,
        qtyToSell: validInteger,
        name: validStringRequired,
        set_name: validStringRequired,
        finishCondition: validFinishConditions,
    });

    const { cards } = req.body;

    try {
        for (let card of cards) {
            const { error }: JoiValidation<FinishSaleCard> = schema.validate(
                card,
                {
                    abortEarly: false,
                    allowUnknown: true,
                }
            );

            if (error) {
                return res.status(400).json(error);
            }
        }

        return next();
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
};

export default finishSaleValidationController;
