const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../../../src/app');
const { Token } = require('../../../src/models');
const setupTestDB = require('../../utils/setupTestDB');
const { emailService } = require('../../../src/services');
const { userOneAccessToken } = require('../../fixtures/token.fixture');
const { insertUsers, userOne } = require('../../fixtures/user.fixture');

setupTestDB();

describe('POST /v1/auth/send-verification-email', () => {
  beforeEach(() => {
    jest.spyOn(emailService.transport, 'sendMail').mockResolvedValue();
  });

  test('should return 204 and send verification email to the user', async () => {
    await insertUsers([userOne]);
    const sendVerificationEmailSpy = jest.spyOn(emailService, 'sendVerificationEmail');

    await request(app)
      .post('/v1/auth/send-verification-email')
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .expect(httpStatus.NO_CONTENT);

    expect(sendVerificationEmailSpy).toHaveBeenCalledWith(userOne.email, expect.any(String));
    const verifyEmailToken = sendVerificationEmailSpy.mock.calls[0][1];
    const dbVerifyEmailToken = await Token.findOne({ token: verifyEmailToken, user: userOne._id });

    expect(dbVerifyEmailToken).toBeDefined();
  });

  test('should return 401 error if access token is missing', async () => {
    await insertUsers([userOne]);

    await request(app).post('/v1/auth/send-verification-email').send().expect(httpStatus.UNAUTHORIZED);
  });
});
