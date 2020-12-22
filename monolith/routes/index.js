const express = require('express');
const router = express.Router();
const getJwt = require('../interactors/getJwt');
const getCardQuantitiesFromInventory = require('../interactors/getCardQuantitiesFromInventory');
const getCardsWithInfo = require('../interactors/getCardsWithInfo');
const getDistinctSetNames = require('../interactors/getDistinctSetNames');
const getCardsByFilter = require('../interactors/getCardsByFilter');

router.post('/jwt', async (req, res) => {
    try {
        const { username, password } = req.body;
        const token = await getJwt(username, password);
        res.status(200).send(token);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.post('/getCardQuantitiesFromInventory', async (req, res) => {
    try {
        const { scryfallIds } = req.body;
        const message = await getCardQuantitiesFromInventory(scryfallIds);
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

        const message = await getCardsWithInfo(title, myMatch);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/getDistinctSetNames', async (req, res) => {
    try {
        const names = await getDistinctSetNames();
        res.status(200).send(names);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/getCardsByFilter', async (req, res) => {
    try {
        const {
            title,
            setName,
            format,
            priceNum,
            priceFilter,
            finish,
            colors,
            colorIdentity,
            sortBy,
            sortByDirection,
            colorSpecificity,
            page,
            type,
            frame,
        } = req.query;

        const message = await getCardsByFilter({
            title,
            setName,
            format,
            priceNum,
            priceFilter,
            finish,
            colors,
            colorIdentity,
            colorSpecificity,
            sortBy,
            sortByDirection,
            page,
            type,
            frame,
        });

        res.status(200).json(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;
