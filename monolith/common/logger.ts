import expressWinston from 'express-winston';
import winston, { transports } from 'winston';

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
});

export const errorLogger = expressWinston.errorLogger({
    transports: [new transports.Console(options)],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
});

export default logger;
