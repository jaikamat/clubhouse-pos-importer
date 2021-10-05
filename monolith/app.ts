import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import createError from 'http-errors';
import path from 'path';
import logger, { errorLogger } from './common/logger';
import authRouter from './routes/auth';
import indexRouter from './routes/index';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/auth', authRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handlers
app.use(errorLogger); // Only logs the error, doesn't handle it
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json(err);
});

export default app;
