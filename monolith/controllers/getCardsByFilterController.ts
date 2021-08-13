require('dotenv').config();
import getCardsByFilter from '../interactors/getCardsByFilter';
import Joi from 'joi';
import {
    validColorSpecificity,
    validFinish,
    validFormatLegalities,
    validFrame,
    validPriceOperator,
    validSort,
    validSortDirection,
    validString,
    validTypeline,
} from '../common/validations';
import {
    ColorSpecificity,
    Finish,
    FormatLegality,
    Frame,
    JoiValidation,
    PriceFilter,
    RequestWithUserInfo,
    SortBy,
    SortByDirection,
    TypeLine,
} from '../common/types';
import { Response } from 'express';

export interface GetCardsByFilterQuery {
    title?: string;
    setName?: string;
    format?: FormatLegality;
    price?: number;
    finish?: Finish;
    colors?: string;
    sortBy?: SortBy;
    colorSpecificity?: ColorSpecificity;
    type?: TypeLine;
    frame?: Frame;
    priceOperator: PriceFilter;
    sortByDirection: SortByDirection;
    page: number;
}

const getCardsByFilterController = async (
    req: RequestWithUserInfo,
    res: Response
) => {
    const schema = Joi.object<GetCardsByFilterQuery>({
        title: validString,
        setName: validString,
        format: validFormatLegalities,
        price: Joi.number().positive().allow(0),
        finish: validFinish,
        colors: validString,
        sortBy: validSort,
        colorSpecificity: validColorSpecificity,
        type: validTypeline,
        frame: validFrame,
        priceOperator: validPriceOperator,
        sortByDirection: validSortDirection,
        page: Joi.number().integer().min(1).required(),
    });

    const { error, value }: JoiValidation<GetCardsByFilterQuery> =
        schema.validate(req.query, {
            abortEarly: false,
        });

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const { currentLocation } = req;

        const message = await getCardsByFilter(value, currentLocation);

        res.status(200).json(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

export default getCardsByFilterController;
