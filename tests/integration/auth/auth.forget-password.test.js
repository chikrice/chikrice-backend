const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../../../src/app');
const { Token } = require('../../../src/models');
const setupTestDB = require('../../utils/setupTestDB');
const { emailService } = require('../../../src/services');
const { insertUsers, userOne } = require('../../fixtures/user.fixture');

setupTestDB();

describe('POST /v1/auth/forgot-password', () => {
  beforeEach(() => {
    jest.spyOn(emailService.transport, 'sendMail').mockResolvedValue();
  });

  test('should return 204 and send reset password email to the user', async () => {
    await insertUsers([userOne]);
    const sendResetPasswordEmailSpy = jest.spyOn(emailService, 'sendResetPasswordEmail');

    await request(app).post('/v1/auth/forgot-password').send({ email: userOne.email }).expect(httpStatus.NO_CONTENT);

    expect(sendResetPasswordEmailSpy).toHaveBeenCalledWith(userOne.email, expect.any(String));
    const resetPasswordToken = sendResetPasswordEmailSpy.mock.calls[0][1];
    const dbResetPasswordTokenDoc = await Token.findOne({ token: resetPasswordToken, user: userOne._id });
    expect(dbResetPasswordTokenDoc).toBeDefined();
  });

  test('should return 400 if email is missing', async () => {
    await insertUsers([userOne]);

    await request(app).post('/v1/auth/forgot-password').send().expect(httpStatus.BAD_REQUEST);
  });

  test('should return 404 if email does not belong to any user', async () => {
    await request(app).post('/v1/auth/forgot-password').send({ email: userOne.email }).expect(httpStatus.NOT_FOUND);
  });
});
