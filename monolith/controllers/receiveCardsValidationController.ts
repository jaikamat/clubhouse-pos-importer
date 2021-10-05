require('dotenv').config();
import Joi from 'joi';
import {
    Controller,
    JoiValidation,
    ReceivingBody,
    ReceivingCard,
    ReqWithReceivingCards,
} from '../common/types';
import {
    validContact,
    validFinishConditions,
    validInteger,
    validName,
    validPrice,
    validStringRequired,
    validTradeType,
} from '../common/validations';

/**
 * Sanitizes card object properties so nothing funky is committed to the database
 */
const receiveCardsValidationController: Controller<ReqWithReceivingCards> = (
    req,
    res,
    next
) => {
    const receivingCardSchema = Joi.object<ReceivingCard>({
        id: validStringRequired,
        quantity: validInteger,
        name: validStringRequired,
        set_name: validStringRequired,
        finishCondition: validFinishConditions,
        set: validStringRequired,
        creditPrice: validPrice,
        cashPrice: validPrice,
        marketPrice: validPrice,
        tradeType: validTradeType,
    });

    const schema = Joi.object<ReceivingBody>({
        customerName: validName,
        customerContact: validContact,
        cards: Joi.array().items(receivingCardSchema),
    });

    try {
        const { error }: JoiValidation<ReceivingCard> = schema.validate(
            req.body,
            { abortEarly: false }
        );

        if (error) {
            return res.status(400).json(error);
        }

        return next();
    } catch (err) {
        res.status(400).json(err.message);
    }
};

export default receiveCardsValidationController;
