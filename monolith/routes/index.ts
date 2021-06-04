import express, { Request } from 'express';
const router = express.Router();
import getJwt from '../interactors/getJwt';
import getCardsWithInfo from '../interactors/getCardsWithInfo';
import getCardFromAllLocations from '../interactors/getCardFromAllLocations';
import autocomplete from '../interactors/autocomplete';
import getCardsFromReceiving from '../interactors/getCardsFromReceiving';

interface RequestWithQuery extends Request {
    query: {
        title: string;
    };
}

router.post('/jwt', async (req, res) => {
    try {
        const { username, password, currentLocation } = req.body;

        const token = await getJwt(username, password, currentLocation);

        res.status(200).send(token);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

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

router.get('/getReceivedCards', async (req, res) => {
    try {
        const message = await getCardsFromReceiving(18, 'ch1', null, null);

        return message;
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

export default router;
