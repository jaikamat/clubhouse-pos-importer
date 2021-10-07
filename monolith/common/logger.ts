import expressWinston from 'express-winston';
import winston, { transports } from 'winston';
import { RequestWithUserInfo } from './types';

const options: transports.ConsoleTransportOptions = {
    handleExceptions: true,
    debugStdout: true,
};

// Living on the edge
expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');

const logger = expressWinston.logger({
    transports: [new transports.Console(options)],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    meta: true,
    expressFormat: true,
    colorize: false,
    /**
     * Log user data if we're in the authController middleware
     */
    dynamicMeta: function (req: RequestWithUserInfo, res) {
        return {
            currentLocation: req.currentLocation ? req.currentLocation : null,
            userId: req.userId ? req.userId : null,
            locations: req.locations ? req.locations : null,
            lightspeedEmployeeNumber: req.lightspeedEmployeeNumber
                ? req.lightspeedEmployeeNumber
                : null,
            isAdmin: req.isAdmin ? req.isAdmin : null,
        };
    },
});

export const errorLogger = expressWinston.errorLogger({
    transports: [new transports.Console(options)],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
});

export default logger;
