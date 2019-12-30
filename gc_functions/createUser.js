const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createUser(username, password1, password2) {
    if (password1 !== password2) {
        throw new Error('Passwords do not match!');
    }

    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();

        console.log('Connection to Mongo esablished');

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password1, salt);

        const db = client.db('test');

        const userCreated = await db.collection('users').insertOne({
            username: username,
            password: hash
        });

        console.log('User created!');
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
        console.log('Disconnected from Mongo');
    }
}

// Run the function
(async () => {
    const usernameIdx = process.argv.indexOf('--username');
    const password1Idx = process.argv.indexOf('--password');
    const password2Idx = process.argv.indexOf('--confirm_password');

    const username = process.argv[usernameIdx + 1];
    const password1 = process.argv[password1Idx + 1];
    const password2 = process.argv[password2Idx + 1];

    await createUser(username, password1, password2);
})();
