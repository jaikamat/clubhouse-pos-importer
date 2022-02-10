require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    locations: Joi.array()
        .items(Joi.string().valid('ch1', 'ch2'))
        .max(2)
        .required(),
    lightspeedEmployeeNumber: Joi.number().required(),
    admin: Joi.boolean().strict().required(),
});

async function createUser({
    username,
    database,
    password1,
    password2,
    location,
    lightspeedEmployeeNumber,
    admin,
}) {
    if (password1 !== password2) {
        throw new Error('Passwords do not match!');
    }

    if (!database) {
        throw new Error('Database name must be provided');
    }

    if (!['test', 'clubhouse_collection_production'].includes(database)) {
        throw new Error('A valid database name was not passed');
    }

    if (!username) {
        throw new Error('Username was not provided');
    }

    if (!location) {
        throw new Error('One location must be provided');
    }

    if (!lightspeedEmployeeNumber) {
        throw new Error('Lightspeed employee number not provided');
    }

    if (admin === null || admin === undefined) {
        throw new Error('Must designate admin');
    }

    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Hash password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password1, salt);

    // Create user entry
    const user = {
        username,
        password: hash,
        locations: [location],
        lightspeedEmployeeNumber,
        admin: JSON.parse(admin),
    };

    // Validation
    Joi.assert(user, userSchema);

    try {
        await client.connect();

        console.log('Connection to Mongo esablished');

        const db = client.db(database);

        await db.collection('users').insertOne(user);

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
    const {
        username,
        database,
        password1,
        password2,
        location,
        lightspeedEmployeeNumber,
        admin,
    } = argv;

    await createUser({
        username: username,
        database: database,
        password1: password1.toString(),
        password2: password2.toString(),
        location: location,
        lightspeedEmployeeNumber: lightspeedEmployeeNumber,
        admin: admin,
    });
})();
