import express from 'express';
const router = express.Router();
import getJwt from '../interactors/getJwt';
import getCardsWithInfo from '../interactors/getCardsWithInfo';

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

export default router;
