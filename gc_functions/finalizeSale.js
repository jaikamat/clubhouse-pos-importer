const request = require('request-promise-native');
require('dotenv').config();

// These cards are the saleItems from the
async function finalizeSale(cards) {
    try {
        const res = await request.get({
            url: process.env.REFRESH_LIGHTSPEED_AUTH_TOKEN
        });

        const data = JSON.parse(res);

        console.log(data);
        console.log(cards);

        return {
            token: data.access_token,
            cards: cards
        };
    } catch (err) {
        console.log(err);
    }
}

exports.finalizeSale = async (req, res) => {
    res.set('Access-Control-Allow-Headers', '*');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');

    try {
        const cards = req.body.cards;
        const message = await finalizeSale(cards);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

exports.finalizeSale = finalizeSale;
