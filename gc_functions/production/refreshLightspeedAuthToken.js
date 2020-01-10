const request = require('request-promise-native');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

/**
 * Initialize express app and use CORS middleware
 */
const app = express();
app.use(cors());

async function refreshLightspeedAuthToken() {
    try {
        const res = await request.post({
            url: 'https://cloud.lightspeedapp.com/oauth/access_token.php',
            form: {
                grant_type: process.env.GRANT_TYPE,
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                refresh_token: process.env.REFRESH_TOKEN
            }
        });

        const { access_token } = JSON.parse(res);

        return { access_token: access_token };
    } catch (err) {
        console.log(err);
    }
}

app.get('/', async (req, res) => {
    try {
        const message = await refreshLightspeedAuthToken();
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

exports.refreshLightspeedAuthToken = app;
