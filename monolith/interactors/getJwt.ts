const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import getDatabaseConnection from '../database';

export type ClubhouseLocation = 'ch1' | 'ch2';

export type User = {
    _id: string;
    password: string;
    username: symbol;
    locations: string[];
    currentLocation: ClubhouseLocation;
    lightspeedEmployeeNumber: number;
};

async function getJwt(
    username: string,
    submittedPass: string,
    currentLocation: ClubhouseLocation
): Promise<{ token: string } | string> {
    try {
        const db = await getDatabaseConnection();

        const user: User = await db.collection('users').findOne({
            username: username,
        });

        if (!user) return 'Not authorized';

        // Retrieve the Clubhouse location permissions and employee number for the user
        const { _id, locations, lightspeedEmployeeNumber, password } = user;

        // Check if the user is allowed in the location
        if (!locations.includes(currentLocation)) {
            return 'Not authorized for this location';
        }

        // Determine if the fetched user's credentials are authorized
        const match = await bcrypt.compareSync(submittedPass, password);

        if (match) {
            const token: string = jwt.sign(
                {
                    userId: _id,
                    username,
                    locations,
                    currentLocation,
                    lightspeedEmployeeNumber,
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
    }
}

export default getJwt;
