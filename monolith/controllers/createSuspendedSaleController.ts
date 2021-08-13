require('dotenv').config();
import createSuspendedSale from '../interactors/createSuspendedSale';
import Joi from 'joi';
import {
    validFinishConditions,
    validInteger,
    validPrice,
    validString,
    validStringRequired,
} from '../common/validations';
import {
    FinishSaleCard,
    JoiValidation,
    ReqWithSuspendSale,
    SuspendSaleBody,
} from '../common/types';
import { Response } from 'express';

const createSuspendedSaleController = async (
    req: ReqWithSuspendSale,
    res: Response
) => {
    const schema = Joi.object<SuspendSaleBody>({
        customerName: validString.min(3).max(100).required(),
        notes: validString.min(0).max(255).allow(''),
        saleList: Joi.array().items(
            Joi.object<FinishSaleCard>({
                id: validStringRequired,
                price: validPrice,
                qtyToSell: validInteger,
                name: validStringRequired,
                set_name: validStringRequired,
                finishCondition: validFinishConditions,
            })
        ),
    });

    const { customerName = '', notes = '', saleList = [] } = req.body;

    const { error }: JoiValidation<SuspendSaleBody> = schema.validate(
        req.body,
        {
            abortEarly: false,
            allowUnknown: true,
        }
    );

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const message = await createSuspendedSale(
            customerName,
            notes,
            saleList,
            req.currentLocation
        );
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
};

export default createSuspendedSaleController;