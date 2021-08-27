require('dotenv').config();
import jwt from 'jsonwebtoken';
import {
    ClubhouseLocation,
    Controller,
    RequestWithUserInfo,
} from '../common/types';
import getUserById, { User } from '../interactors/getUserById';

interface DecodedToken {
    userId: string;
    currentLocation: ClubhouseLocation;
}

/**
 * Middleware to check for Bearer token by validating JWT
 *
 * It attaches current user information to the req for downstream use
 */
const authController: Controller<RequestWithUserInfo> = async (
    req,
    res,
    next
) => {
    let token = req.headers['authorization']; // Express headers converted to lowercase

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        try {
            // Will throw error if validation fails
            const { userId, currentLocation } = jwt.verify(
                token,
                process.env.PRIVATE_KEY
            ) as DecodedToken;

            const user: User = await getUserById(userId);

            // Attach current location information to the req
            // TODO: This should eventually just be a "store id"
            req.currentLocation = currentLocation;

            // Attach user information
            req.userId = userId;
            req.locations = user.locations;
            req.lightspeedEmployeeNumber = user.lightspeedEmployeeNumber;

            // Flag admins
            req.isAdmin = user.locations.length === 2;

            console.log(
                `Operation started by ${user.username} at location ${currentLocation}`
            );

            return next();
        } catch (err) {
            console.log(err);
            res.status(401).send('Invalid token');
        }
    } else {
        res.status(401).send('No token present on request');
    }
};

export default authController;
