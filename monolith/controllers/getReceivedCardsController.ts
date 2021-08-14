require('dotenv').config();
import getCardsFromReceiving from '../interactors/getCardsFromReceiving';
import Joi from 'joi';
import { validDate, validString } from '../common/validations';
import {
    Controller,
    JoiValidation,
    RequestWithUserInfo,
} from '../common/types';
import moment from 'moment';

interface ReceivedCardQuery {
    startDate: string | null;
    endDate: string | null;
    cardName: string | null;
}

const getReceivedCardsController: Controller<RequestWithUserInfo> = async (
    req,
    res
) => {
    const schema = Joi.object<ReceivedCardQuery>({
        startDate: validDate,
        endDate: validDate,
        cardName: validString.allow(null),
    });

    const { error, value }: JoiValidation<ReceivedCardQuery> = schema.validate(
        req.query,
        {
            abortEarly: false,
        }
    );

    if (error) {
        return res.status(400).json(error);
    }

    const { startDate, endDate, cardName } = value;

    try {
        const message = await getCardsFromReceiving({
            location: req.currentLocation,
            startDate: moment(startDate).utc().startOf('day').toDate(),
            endDate: moment(endDate).utc().endOf('day').toDate(),
            cardName: cardName || null,
        });

        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

export default getReceivedCardsController;
