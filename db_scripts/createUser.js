require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

async function createUser(username, database, password1, password2, location) {
    if (password1 !== password2) {
        throw new Error("Passwords do not match!");
    }

    if (!database) {
        throw new Error("Database name must be provided");
    }

    if (!["test", "clubhouse_collection_production"].includes(database)) {
        throw new Error("A valid database name was not passed");
    }

    if (!username) {
        throw new Error("Username was not provided");
    }

    if (!location) {
        throw new Error("One location must be provided");
    }

    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();

        console.log("Connection to Mongo esablished");

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password1, salt);

        const db = client.db(database);

        await db.collection("users").insertOne({
            username,
            password: hash,
            locations: [location],
        });

        console.log("User created!");
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
        console.log("Disconnected from Mongo");
    }
}

// Run the function
(async () => {
    const { username, database, password1, password2, location } = argv;

    await createUser(
        username,
        database,
        password1.toString(),
        password2.toString(),
        location
    );
})();
