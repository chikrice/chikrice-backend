const request = require('supertest');
const httpStatus = require('http-status');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const { insertUsers, userOne } = require('../../fixtures/user.fixture');
const setupTestDB = require('../../utils/setupTestDB');
const app = require('../../../src/app');
const { Token, User } = require('../../../src/models');
const { tokenService } = require('../../../src/services');
const { tokenTypes } = require('../../../src/config/tokens');
const config = require('../../../src/config/config');

setupTestDB();

describe('POST /v1/auth/reset-password', () => {
  test('should return 204 and reset the password', async () => {
    await insertUsers([userOne]);
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
    await tokenService.saveToken(resetPasswordToken, userOne._id, expires, tokenTypes.RESET_PASSWORD);

    await request(app)
      .post('/v1/auth/reset-password')
      .query({ token: resetPasswordToken })
      .send({ password: 'password2' })
      .expect(httpStatus.NO_CONTENT);

    const dbUser = await User.findById(userOne._id);
    const isPasswordMatch = await bcrypt.compare('password2', dbUser.password);
    expect(isPasswordMatch).toBe(true);

    const dbResetPasswordTokenCount = await Token.countDocuments({
      user: userOne._id,
      type: tokenTypes.RESET_PASSWORD,
    });
    expect(dbResetPasswordTokenCount).toBe(0);
  });

  test('should return 400 if reset password token is missing', async () => {
    await insertUsers([userOne]);

    await request(app).post('/v1/auth/reset-password').send({ password: 'password2' }).expect(httpStatus.BAD_REQUEST);
  });

  test('should return 401 if reset password token is blacklisted', async () => {
    await insertUsers([userOne]);
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
    await tokenService.saveToken(resetPasswordToken, userOne._id, expires, tokenTypes.RESET_PASSWORD, true);

    await request(app)
      .post('/v1/auth/reset-password')
      .query({ token: resetPasswordToken })
      .send({ password: 'password2' })
      .expect(httpStatus.UNAUTHORIZED);
  });

  test('should return 401 if reset password token is expired', async () => {
    await insertUsers([userOne]);
    const expires = moment().subtract(1, 'minutes');
    const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
    await tokenService.saveToken(resetPasswordToken, userOne._id, expires, tokenTypes.RESET_PASSWORD);

    await request(app)
      .post('/v1/auth/reset-password')
      .query({ token: resetPasswordToken })
      .send({ password: 'password2' })
      .expect(httpStatus.UNAUTHORIZED);
  });

  test('should return 401 if user is not found', async () => {
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
    await tokenService.saveToken(resetPasswordToken, userOne._id, expires, tokenTypes.RESET_PASSWORD);

    await request(app)
      .post('/v1/auth/reset-password')
      .query({ token: resetPasswordToken })
      .send({ password: 'password2' })
      .expect(httpStatus.UNAUTHORIZED);
  });

  test('should return 400 if password is missing or invalid', async () => {
    await insertUsers([userOne]);
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
    await tokenService.saveToken(resetPasswordToken, userOne._id, expires, tokenTypes.RESET_PASSWORD);

    await request(app)
      .post('/v1/auth/reset-password')
      .query({ token: resetPasswordToken })
      .expect(httpStatus.BAD_REQUEST);

    await request(app)
      .post('/v1/auth/reset-password')
      .query({ token: resetPasswordToken })
      .send({ password: 'short1' })
      .expect(httpStatus.BAD_REQUEST);

    await request(app)
      .post('/v1/auth/reset-password')
      .query({ token: resetPasswordToken })
      .send({ password: 'password' })
      .expect(httpStatus.BAD_REQUEST);

    await request(app)
      .post('/v1/auth/reset-password')
      .query({ token: resetPasswordToken })
      .send({ password: '11111111' })
      .expect(httpStatus.BAD_REQUEST);
  });
});
