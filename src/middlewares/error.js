const mongoose = require('mongoose');
const httpStatus = require('http-status');

const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  // Ensure proper JSON response format
  const response = {
    success: false,
    error: {
      code: statusCode,
      message,
      timestamp: err.timestamp || new Date().toISOString(),
    },
  };

  // Add stack trace in development mode
  if (config.env === 'development') {
    response.error.stack = err.stack;
  }

  if (config.env === 'development') {
    logger.error(err);
  }

  // Set proper content type and send JSON response
  res.status(statusCode).json(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
