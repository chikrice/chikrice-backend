const request = require('supertest');
const httpStatus = require('http-status');
const moment = require('moment');
const { insertUsers, userOne } = require('../../fixtures/user.fixture');
const setupTestDB = require('../../utils/setupTestDB');

const app = require('../../../src/app');
const { Token } = require('../../../src/models');
const config = require('../../../src/config/config');
const { tokenService } = require('../../../src/services');
const { tokenTypes } = require('../../../src/config/tokens');

setupTestDB();

describe('POST v1/auth/logout', () => {
  // CASE OK
  test('should return 204 if refresh token is valid', async () => {
    await insertUsers([userOne]);
    const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH);
    await tokenService.saveToken(refreshToken, userOne._id, expires, tokenTypes.REFRESH);

    await request(app).post('/v1/auth/logout').send({ refreshToken }).expect(httpStatus.NO_CONTENT);

    const dbRefreshTokenDoc = await Token.findOne({ token: refreshToken });
    expect(dbRefreshTokenDoc).toBe(null);
  });

  // CASE 400
  test('should return 400 error if refresh token is missing from request body', async () => {
    await request(app).post('/v1/auth/logout').send().expect(httpStatus.BAD_REQUEST);
  });

  // CASE 404
  test('should return 404 error if refresh token is not found in the database', async () => {
    await insertUsers([userOne]);
    const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH);

    await request(app).post('/v1/auth/logout').send({ refreshToken }).expect(httpStatus.NOT_FOUND);
  });

  // CASE 404
  test('should return 404 error if refresh token is blacklisted', async () => {
    await insertUsers([userOne]);
    const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH);
    await tokenService.saveToken(refreshToken, userOne._id, expires, tokenTypes.REFRESH, true);

    await request(app).post('/v1/auth/logout').send({ refreshToken }).expect(httpStatus.NOT_FOUND);
  });
});
