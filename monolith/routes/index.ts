import express, { Request } from 'express';
const router = express.Router();
import getJwt, { ClubhouseLocation } from '../interactors/getJwt';
import getCardsWithInfo from '../interactors/getCardsWithInfo';
import getCardFromAllLocations from '../interactors/getCardFromAllLocations';
import autocomplete from '../interactors/autocomplete';
import Joi from 'joi';

interface JwtBody {
    username: string;
    password: string;
    currentLocation: ClubhouseLocation;
}

interface JwtRequest extends Request {
    body: JwtBody;
}

router.post('/jwt', async (req: JwtRequest, res) => {
    const schema = Joi.object<JwtBody>({
        username: Joi.string().required(),
        password: Joi.string().required(),
        currentLocation: Joi.string().valid('ch1', 'ch2').required(),
    });

    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
    });

    if (error) {
        res.status(400).json(error);
    }

    try {
        const { username, password, currentLocation } = req.body;

        const token = await getJwt(username, password, currentLocation);

        res.status(200).send(token);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

interface RequestWithQuery extends Request {
    query: {
        title: string;
    };
}

router.get('/autocomplete', async (req: RequestWithQuery, res) => {
    try {
        const { title } = req.query;
        const results = await autocomplete(title);
        res.status(200).send(results);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/getCardsWithInfo', async (req, res) => {
    try {
        const { title, matchInStock, location } = req.query;
        const myMatch = matchInStock === 'true';

        if (
            typeof title === 'string' &&
            (location === 'ch1' || location === 'ch2')
        ) {
            const message = await getCardsWithInfo(title, myMatch, location);
            res.status(200).send(message);
        } else {
            throw new Error('title should be a string');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/getCardFromAllLocations', async (req, res) => {
    try {
        const { title } = req.query;

        if (typeof title === 'string') {
            const message = await getCardFromAllLocations(title);
            res.status(200).send(message);
        } else {
            throw new Error('title should be a string');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

export default router;
