const config = require('@/config/config');

const { version } = require('../../package.json');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'chikrice-backend API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/chikrice/chikrice-backend/blob/main/LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;
