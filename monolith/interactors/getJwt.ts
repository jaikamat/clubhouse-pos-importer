const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import getDatabaseName from '../lib/getDatabaseName';
const DATABASE_NAME = getDatabaseName();

export type ClubhouseLocation = 'ch1' | 'ch2';

export type User = {
    password: string;
    username: symbol;
    locations: string[];
    currentLocation: ClubhouseLocation;
};

async function getJwt(
    username: string,
    submittedPass: string,
    currentLocation: ClubhouseLocation
): Promise<{ token: string } | string> {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();

        const db = client.db(DATABASE_NAME);

        const user: User = await db.collection('users').findOne({
            username: username,
        });

        if (!user) return 'Not authorized';

        // Retrieve the Clubhouse location permissions for the user
        const { locations } = user;

        // Check if the user is allowed in the location
        if (!locations.includes(currentLocation)) {
            return 'Not authorized for this location';
        }

        // Determine if the fetched user's credentials are authorized
        const match = await bcrypt.compareSync(submittedPass, user.password);

        if (match) {
            const token: string = jwt.sign(
                {
                    username,
                    locations,
                    currentLocation,
                },
                process.env.PRIVATE_KEY
            );

            return { token: token };
        } else {
            return 'Not authorized';
        }
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}

export default getJwt;
