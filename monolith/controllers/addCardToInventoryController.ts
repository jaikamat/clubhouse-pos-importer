require('dotenv').config();
import addCardToInventory from '../interactors/addCardToInventory';
import {
    Controller,
    FinishCondition,
    JoiValidation,
    RequestWithUserInfo,
} from '../common/types';
import Joi from 'joi';
import {
    validFinishConditions,
    validInteger,
    validStringRequired,
} from '../common/validations';

interface AddCardToInventoryReqBody {
    quantity: number;
    finishCondition: FinishCondition;
    cardInfo: {
        id: string;
        name: string;
        set_name: string;
        set: string;
    };
}

interface AddCardToInventoryReq extends RequestWithUserInfo {
    body: AddCardToInventoryReqBody;
}

const addCardToInventoryController: Controller<AddCardToInventoryReq> = async (
    req,
    res
) => {
    try {
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

        const { error }: JoiValidation<AddCardToInventoryReqBody> =
            schema.validate(req.body, {
                abortEarly: false,
                allowUnknown: true,
            });

        if (error) {
            return res.status(400).json(error);
        }

        const { quantity, finishCondition, cardInfo } = req.body;
        const { currentLocation: location } = req;
        const { id, name, set_name, set } = cardInfo;
        const message = await addCardToInventory({
            quantity,
            finishCondition,
            id,
            name,
            set_name,
            set,
            location,
        });
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

export default addCardToInventoryController;
