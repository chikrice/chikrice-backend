const moment = require('moment');
const request = require('supertest');
const httpStatus = require('http-status');
const setupTestDB = require('../../utils/setupTestDB');
const app = require('../../../src/app');
const { Token } = require('../../../src/models');
const config = require('../../../src/config/config');
const { tokenTypes } = require('../../../src/config/tokens');
const { insertUsers, userOne } = require('../../fixtures/user.fixture');
const { tokenService } = require('../../../src/services');

setupTestDB();

describe('POST /v1/auth/refresh-tokens', () => {
  test('should return 200 and new auth tokens if refresh token is valid', async () => {
    await insertUsers([userOne]);
    const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH);
    await tokenService.saveToken(refreshToken, userOne._id, expires, tokenTypes.REFRESH);

    const res = await request(app).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(httpStatus.OK);

    expect(res.body).toEqual({
      access: { token: expect.anything(), expires: expect.anything() },
      refresh: { token: expect.anything(), expires: expect.anything() },
    });

    const dbRefreshTokenDoc = await Token.findOne({ token: res.body.refresh.token });
    expect(dbRefreshTokenDoc).toMatchObject({ type: tokenTypes.REFRESH, user: userOne._id, blacklisted: false });

    const dbRefreshTokenCount = await Token.countDocuments();
    expect(dbRefreshTokenCount).toBe(1);
  });

  test('should return 400 error if refresh token is missing from request body', async () => {
    await request(app).post('/v1/auth/refresh-tokens').send().expect(httpStatus.BAD_REQUEST);
  });

  test('should return 401 error if refresh token is signed using an invalid secret', async () => {
    await insertUsers([userOne]);
    const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH, 'invalidSecret');
    await tokenService.saveToken(refreshToken, userOne._id, expires, tokenTypes.REFRESH);

    await request(app).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(httpStatus.UNAUTHORIZED);
  });

  test('should return 401 error if refresh token is not found in the database', async () => {
    await insertUsers([userOne]);
    const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH);

    await request(app).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(httpStatus.UNAUTHORIZED);
  });

  test('should return 401 error if refresh token is blacklisted', async () => {
    await insertUsers([userOne]);
    const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH);
    await tokenService.saveToken(refreshToken, userOne._id, expires, tokenTypes.REFRESH, true);

    await request(app).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(httpStatus.UNAUTHORIZED);
  });

  test('should return 401 error if refresh token is expired', async () => {
    await insertUsers([userOne]);
    const expires = moment().subtract(1, 'minutes');
    const refreshToken = tokenService.generateToken(userOne._id, expires);
    await tokenService.saveToken(refreshToken, userOne._id, expires, tokenTypes.REFRESH);

    await request(app).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(httpStatus.UNAUTHORIZED);
  });

  test('should return 401 error if user is not found', async () => {
    const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH);
    await tokenService.saveToken(refreshToken, userOne._id, expires, tokenTypes.REFRESH);

    await request(app).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(httpStatus.UNAUTHORIZED);
  });
});
