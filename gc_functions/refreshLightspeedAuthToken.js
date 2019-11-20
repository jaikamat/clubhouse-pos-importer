const request = require('request-promise-native');
require('dotenv').config();

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

exports.refreshLightspeedAuthToken = async (req, res) => {
    res.set('Access-Control-Allow-Headers', '*');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');

    try {
        const message = await refreshLightspeedAuthToken();
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

exports.refreshLightspeedAuthToken = refreshLightspeedAuthToken;
