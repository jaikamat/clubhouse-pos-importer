const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { ClubhouseLocation } from '../common/types';
import getUserByName, { User } from './getUserByName';

async function getJwt(
    username: string,
    submittedPass: string,
    currentLocation: ClubhouseLocation
): Promise<{ token: string; admin: boolean } | string> {
    try {
        const user: User = await getUserByName(username);

        if (!user) return 'Not authorized';

        // Retrieve the Clubhouse location permissions and employee number for the user
        const { _id, locations, password, admin } = user;

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
                    currentLocation,
                },
                process.env.PRIVATE_KEY
            );

            return { token, admin };
        } else {
            return 'Not authorized';
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default getJwt;
