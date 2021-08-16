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
    Controller,
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

export interface GetCardsByFilterQuery {
    title?: string;
    setName?: string;
    format?: FormatLegality;
    finish?: Finish;
    colors?: string;
    sortBy?: SortBy;
    colorSpecificity?: ColorSpecificity;
    type?: TypeLine;
    frame?: Frame;
    priceOperator: PriceFilter;
    sortByDirection: SortByDirection;
    page: number;
    maxPrice?: number;
    minPrice?: number;
}

const getCardsByFilterController: Controller<RequestWithUserInfo> = async (
    req,
    res
) => {
    const schema = Joi.object<GetCardsByFilterQuery>({
        title: validString,
        setName: validString,
        format: validFormatLegalities,
        finish: validFinish,
        colors: validString,
        sortBy: validSort,
        colorSpecificity: validColorSpecificity,
        type: validTypeline,
        frame: validFrame,
        priceOperator: validPriceOperator,
        sortByDirection: validSortDirection,
        maxPrice: Joi.number(),
        minPrice: Joi.number(),
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
