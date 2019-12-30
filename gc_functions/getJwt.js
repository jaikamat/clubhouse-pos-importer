const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function getJwt(username, submittedPass) {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        const db = client.db('test');

        const { password } = await db.collection('users').findOne({
            username: username
        });

        // Determine if the user is authorized
        const match = await bcrypt.compareSync(submittedPass, password);

        if (match) {
            const token = jwt.sign(
                { username: username, admin: true },
                process.env.PRIVATE_KEY
            );

            return token;
        } else {
            return 'Not authorized';
        }
    } catch (err) {
        console.log(err);
        return err;
    } finally {
        await client.close();
        console.log('Disconnected from Mongo');
    }
}

exports.getJwt = async (req, res) => {
    res.set('Access-Control-Allow-Headers', '*');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');

    try {
        const { username, password } = req.body;
        const token = await getJwt(username, password);
        res.status(200).send({ token: token });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};
