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
import isValidInventory from '../interactors/isValidInventory';

/**
 * Sale middleware that sanitizes card array to ensure inputs are valid. Will throw errors and end sale if needed
 */
const finishSaleValidationController: Controller<ReqWithFinishSaleCards> =
    async (req, res, next) => {
        const schema = Joi.object<FinishSaleCard>({
            id: validStringRequired,
            price: validPrice,
            qtyToSell: validInteger,
            name: validStringRequired,
            set_name: validStringRequired,
            finishCondition: validFinishConditions,
        });

        const { cards } = req.body;
        const { currentLocation } = req;

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

        /**
         * Determine if any of the passed cards's intended sale quantities exceed available inventory
         */
        const validations = cards.map(async (c) => {
            await isValidInventory(c, currentLocation);
        });

        await Promise.all(validations);

        return next();
    };

export default finishSaleValidationController;
