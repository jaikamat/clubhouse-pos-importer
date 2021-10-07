import express from 'express';
import Joi from 'joi';
import logger from '../common/logger';
import {
    ClubhouseLocation,
    JoiValidation,
    JwtBody,
    JwtRequest,
    locations,
} from '../common/types';
import autocomplete from '../interactors/autocomplete';
import getCardFromAllLocations from '../interactors/getCardFromAllLocations';
import getCardsWithInfo from '../interactors/getCardsWithInfo';
import getJwt from '../interactors/getJwt';
const router = express.Router();

// Use logging for this endpoint
router.use(logger);

router.post('/jwt', async (req: JwtRequest, res) => {
    const schema = Joi.object<JwtBody>({
        username: Joi.string().required(),
        password: Joi.string().required(),
        currentLocation: Joi.string().valid('ch1', 'ch2').required(),
    });

    const { error }: JoiValidation<JwtBody> = schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
    });

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const { username, password, currentLocation } = req.body;

        const token = await getJwt(username, password, currentLocation);

        res.status(200).json(token);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

interface AutocompleteQuery {
    title: string;
}

router.get('/autocomplete', async (req, res) => {
    const schema = Joi.object<AutocompleteQuery>({
        title: Joi.string().required(),
    });

    const { error, value }: JoiValidation<AutocompleteQuery> = schema.validate(
        req.query,
        {
            abortEarly: false,
        }
    );

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const results = await autocomplete(value.title);
        res.status(200).json(results);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

interface GetCardsWithInfoQuery {
    title: string;
    matchInStock: boolean;
    location: ClubhouseLocation;
}

router.get('/getCardsWithInfo', async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        matchInStock: Joi.boolean().required(),
        location: Joi.string()
            .valid(...locations)
            .required(),
    });

    const { error, value }: JoiValidation<GetCardsWithInfoQuery> =
        schema.validate(req.query, {
            abortEarly: false,
        });

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const { title, matchInStock, location } = value;

        const message = await getCardsWithInfo(title, matchInStock, location);
        res.status(200).json(message);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

interface GetCardFromAllLocationsQuery {
    title: string;
}

router.get('/getCardFromAllLocations', async (req, res) => {
    const schema = Joi.object<GetCardFromAllLocationsQuery>({
        title: Joi.string().required(),
    });

    const { error, value }: JoiValidation<GetCardFromAllLocationsQuery> =
        schema.validate(req.query, {
            abortEarly: false,
        });

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const message = await getCardFromAllLocations(value.title);
        res.status(200).json(message);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

export default router;
