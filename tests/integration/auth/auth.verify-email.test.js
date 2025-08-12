const moment = require('moment');
const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../../../src/app');
const config = require('../../../src/config/config');
const setupTestDB = require('../../utils/setupTestDB');
const { Token, User } = require('../../../src/models');
const { tokenService } = require('../../../src/services');
const { tokenTypes } = require('../../../src/config/tokens');
const { insertUsers, userOne } = require('../../fixtures/user.fixture');

setupTestDB();

describe('POST /v1/auth/verify-email', () => {
  test('should return 204 and verify the email', async () => {
    await insertUsers([userOne]);
    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = tokenService.generateToken(userOne._id, expires);
    await tokenService.saveToken(verifyEmailToken, userOne._id, expires, tokenTypes.VERIFY_EMAIL);

    await request(app)
      .post('/v1/auth/verify-email')
      .query({ token: verifyEmailToken })
      .send()
      .expect(httpStatus.NO_CONTENT);

    const dbUser = await User.findById(userOne._id);

    expect(dbUser.isEmailVerified).toBe(true);

    const dbVerifyEmailToken = await Token.countDocuments({
      user: userOne._id,
      type: tokenTypes.VERIFY_EMAIL,
    });
    expect(dbVerifyEmailToken).toBe(0);
  });

  test('should return 400 if verify email token is missing', async () => {
    await insertUsers([userOne]);

    await request(app).post('/v1/auth/verify-email').send().expect(httpStatus.BAD_REQUEST);
  });

  test('should return 401 if verify email token is blacklisted', async () => {
    await insertUsers([userOne]);
    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = tokenService.generateToken(userOne._id, expires);
    await tokenService.saveToken(verifyEmailToken, userOne._id, expires, tokenTypes.VERIFY_EMAIL, true);

    await request(app)
      .post('/v1/auth/verify-email')
      .query({ token: verifyEmailToken })
      .send()
      .expect(httpStatus.UNAUTHORIZED);
  });

  test('should return 401 if verify email token is expired', async () => {
    await insertUsers([userOne]);
    const expires = moment().subtract(1, 'minutes');
    const verifyEmailToken = tokenService.generateToken(userOne._id, expires);
    await tokenService.saveToken(verifyEmailToken, userOne._id, expires, tokenTypes.VERIFY_EMAIL);

    await request(app)
      .post('/v1/auth/verify-email')
      .query({ token: verifyEmailToken })
      .send()
      .expect(httpStatus.UNAUTHORIZED);
  });

  test('should return 401 if user is not found', async () => {
    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = tokenService.generateToken(userOne._id, expires);
    await tokenService.saveToken(verifyEmailToken, userOne._id, expires, tokenTypes.VERIFY_EMAIL);

    await request(app)
      .post('/v1/auth/verify-email')
      .query({ token: verifyEmailToken })
      .send()
      .expect(httpStatus.UNAUTHORIZED);
  });
});
