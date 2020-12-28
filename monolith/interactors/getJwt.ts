const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import fetchDbName from '../lib/fetchDbName';
const DATABASE_NAME = fetchDbName();

export type User = {
    password: string;
    username: symbol;
    locations?: string[];
};

async function getJwt(
    username: string,
    submittedPass: string
): Promise<{ token: string } | string> {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        const db = client.db(DATABASE_NAME);

        const user: User = await db.collection('users').findOne({
            username: username,
        });

        if (!user) return 'Not authorized';

        // Retrieve the Clubhouse location permissions for the user
        const { locations } = user;

        // Determine if the fetched user is authorized
        const match = await bcrypt.compareSync(submittedPass, user.password);

        if (match) {
            const token: string = jwt.sign(
                {
                    username,
                    locations: locations ? locations : [],
                },
                process.env.PRIVATE_KEY
            );

            return { token: token };
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

export default getJwt;
