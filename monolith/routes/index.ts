import express from 'express';
const router = express.Router();
import getJwt from '../interactors/getJwt';
import getCardQuantitiesFromInventory from '../interactors/getCardQuantitiesFromInventory';
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

router.post('/getCardQuantitiesFromInventory', async (req, res) => {
    try {
        const { scryfallIds } = req.body;
        // TODO: intake dynamic location
        const message = await getCardQuantitiesFromInventory(
            scryfallIds,
            'ch1'
        );
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/getCardsWithInfo', async (req, res) => {
    try {
        const { title, matchInStock } = req.query;
        const myMatch = matchInStock === 'true';

        if (typeof title === 'string') {
            // TODO: intake dynamic location
            const message = await getCardsWithInfo(title, myMatch, 'ch1');
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
