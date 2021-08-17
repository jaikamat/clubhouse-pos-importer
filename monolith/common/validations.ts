import Joi from 'joi';
import {
    colorSpecificity,
    finish,
    finishConditions,
    formatLegalities,
    frames,
    sortBy,
    sortByDirection,
    Trade,
    typeLines,
} from './types';

export const validFinishConditions = Joi.string()
    .valid(...finishConditions)
    .required();
export const validFormatLegalities = Joi.string().valid(...formatLegalities);
export const validFinish = Joi.string().valid(...finish);
export const validSort = Joi.string().valid(...sortBy);
export const validColorSpecificity = Joi.string().valid(...colorSpecificity);
export const validTypeline = Joi.string().valid(...typeLines);
export const validFrame = Joi.string().valid(...frames);
export const validSortDirection = Joi.number()
    .valid(...sortByDirection)
    .required();
export const validDate = Joi.date().iso().required();
export const validString = Joi.string();
export const validStringRequired = Joi.string().required();
export const validName = Joi.string().min(3).max(50).required();
export const validContact = Joi.string().max(50).allow(null);
export const validInteger = Joi.number().integer().required();
export const validPrice = Joi.number().min(0).required();
export const validTradeType = Joi.string()
    .valid(Trade.Cash, Trade.Credit)
    .required();
