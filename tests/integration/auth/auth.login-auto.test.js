const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../../../src/app');
const { User } = require('../../../src/models');
const setupTestDB = require('../../utils/setupTestDB');
const { userThreeAccessToken } = require('../../fixtures/token.fixture');
const { insertUsers, userThree } = require('../../fixtures/user.fixture');

setupTestDB();

describe('POST /v1/auth/me', () => {
  // 200
  test('should return 200 and obtain new set of tokens(access, refresh) if user acessToken is valid', async () => {
    await insertUsers([userThree]);

    const res = await request(app)
      .post('/v1/auth/me')
      .send({ accessToken: userThreeAccessToken })
      .expect(httpStatus.OK);

    const { password, _id, ...resetOfUserThreeData } = userThree;
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).toEqual({
      id: _id.toHexString(),
      ...resetOfUserThreeData,
      registrationMethod: 'manual',
    });

    const dbUser = await User.findById(res.body.user.id);
    expect(dbUser).toBeDefined();
    expect(dbUser.password).not.toBe(password);

    // Convert the Mongoose document to a plain object
    const dbUserObject = dbUser.toObject();

    // Ensure the plain object matches the expected object
    expect(dbUserObject).toMatchObject({ ...resetOfUserThreeData });
  });

  // 401
  test('should return 400 if accessToken is invalid', async () => {
    await insertUsers([userThree]);

    await request(app).post('/v1/auth/me').send({ accessToken: 'invalidToken' }).expect(httpStatus.UNAUTHORIZED);
  });
});
