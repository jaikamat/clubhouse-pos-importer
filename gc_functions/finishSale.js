const request = require('request-promise-native');
const axios = require('axios');
require('dotenv').config();

// // // These cards are the saleItems from the New Sale feature
// // async function finalizeSale(cards) {
// //     try {
// //         // const res = await request.get({
// //         //     url: process.env.REFRESH_LIGHTSPEED_AUTH_TOKEN
// //         // });

// //         // const data = JSON.parse(res);

// //         const firstCard = cards[0];

// //         console.log('cards.length inner function', cards.length);

// //         console.log('id', firstCard.id);
// //         console.log('qtyToSell', firstCard.qtyToSell);
// //         console.log('finishCondition', firstCard.finishCondition);

// //         // const alterInventoryLevels = cards.map(async card => {
// //         //     return await axios.post(
// //         //         'https://us-central1-clubhouse-collection.cloudfunctions.net/finalizeSale',
// //         //         {
// //         //             quantity: -Math.abs(firstCard.qtyToSell),
// //         //             type: firstCard.finishCondition,
// //         //             cardInfo: firstCard
// //         //         }
// //         //     );
// //         // });

// //         // return await Promise.all(alterInventoryLevels);
// //     } catch (err) {
// //         console.log(err);
// //     }
// // }

// // exports.finalizeSale = async (req, res) => {
// //     res.set('Access-Control-Allow-Headers', '*');
// //     res.set('Access-Control-Allow-Origin', '*');
// //     res.set('Access-Control-Allow-Methods', 'POST');

// //     try {
// //         const cards = req.body.cards;

// //         for (let prop in req.body) {
// //             if (req.body.hasOwnProperty(prop)) {
// //                 console.log(prop);
// //             }
// //         }

// //         console.log('cards.length outer function', cards.length);
// //         const message = await finalizeSale(cards);
// //         res.status(200).send(message);
// //     } catch (err) {
// //         console.log(err);
// //         res.status(500).send(err);
// //     }
// // };

// // exports.finalizeSale = finalizeSale;

// async function finalizeSale(cards) {
//     try {
//         console.log('got the cards!', cards.length);
//         return cards.length;
//     } catch (err) {
//         console.log(err);
//     }
// }

async function finishSale(cards) {
    try {
        const res = await request.get({
            url: process.env.REFRESH_LIGHTSPEED_AUTH_TOKEN
        });

        console.log(Array.isArray(cards));
        console.log(typeof cards);
        const firstCard = cards[0] ? cards[0] : 'Something is broken';

        // const firstCard = cards[0];

        // const firstCardCommit = await axios.post(
        //     'https://us-central1-clubhouse-collection.cloudfunctions.net/finalizeSale',
        //     {
        //         quantity: -Math.abs(firstCard.qtyToSell),
        //         type: firstCard.finishCondition,
        //         cardInfo: firstCard
        //     }
        // );

        const data = JSON.parse(res);

        return { cards: cards, data: data };
    } catch (err) {
        console.log(err);
    }
}

exports.finishSale = async (req, res) => {
    // Note: The finishSale function will trigger twice if we do not
    // detect an OPTIONS complex CORS preflight request, which causes errors
    // as the request body is undefined on first execution
    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Headers', '*');
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    }

    try {
        res.set('Access-Control-Allow-Headers', '*');
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'POST');

        const { cards } = req.body;
        const data = await finishSale(cards);
        res.status(200).send(data);
    } catch (err) {
        res.statues(400).send(err);
    }
};
