const mongoose = require('mongoose');

const app = require('@/app');
const config = require('@/config/config');
const logger = require('@/config/logger');

import type { Server } from 'http';

// -------------------------------------

let server: Server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });

  // Periodic memory usage logging (disabled in test)
  if (config.env !== 'test') {
    const formatMem = (bytes: number) => `${Math.round(bytes / 1024 / 1024)}MB`;
    setInterval(() => {
      const m = process.memoryUsage();
      logger.info(
        `mem rss=${formatMem(m.rss)} heapUsed=${formatMem(m.heapUsed)} heapTotal=${formatMem(
          m.heapTotal,
        )} ext=${formatMem(m.external)}`,
      );
    }, 30000).unref();
  }
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
