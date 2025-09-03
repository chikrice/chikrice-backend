const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const express = require('express');
const passport = require('passport');
const httpStatus = require('http-status');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');

const routes = require('@/routes/v1');
const morgan = require('@/config/morgan');
const config = require('@/config/config');
const logger = require('@/config/logger');
const ApiError = require('@/utils/ApiError');
const { jwtStrategy } = require('@/config/passport');
const { authLimiter } = require('@/middlewares/rateLimiter');
const { errorConverter, errorHandler } = require('@/middlewares/error');

import type { Request, Response, NextFunction } from 'express';

require('@/cron/roadmap-job');

// -------------------------------------

if (config.env === 'development') {
  logger.debug(`config: ${JSON.stringify({ env: config.env, port: config.port }, null, 2)}`);
}

const app = express();
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body with sane limits
app.use(express.json({ limit: '1mb' }));

// parse urlencoded request body with sane limits
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors({ origin: '*', credentials: true }));
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// lightweight per-request memory logging (only in production)
if (config.env === 'production') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    const m = process.memoryUsage();
    logger.info(
      `mem route=${req.method} ${req.originalUrl} rss=${Math.round(m.rss / 1024 / 1024)}MB heapUsed=${Math.round(
        m.heapUsed / 1024 / 1024,
      )}MB heapTotal=${Math.round(m.heapTotal / 1024 / 1024)}MB`,
    );
    next();
  });
}

// send back a 404 error for any unknown api request
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
