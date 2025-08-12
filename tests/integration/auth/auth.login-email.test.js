const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../../../src/app');
const { User } = require('../../../src/models');
const setupTestDB = require('../../utils/setupTestDB');
const { insertUsers, userOne, defaultNullData, userThree } = require('../../fixtures/user.fixture');

setupTestDB();

describe('POST v1/auth/login', () => {
  // CASE user with default null data
  test('should return 200 and user data with default null values if credentials are valid', async () => {
    const loginCredentials = {
      email: userOne.email,
      password: userOne.password,
    };

    await insertUsers([userOne]);

    const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.OK);

    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).toEqual({
      id: expect.anything(),
      name: userOne.name,
      email: userOne.email,
      role: userOne.role,
      isEmailVerified: userOne.isEmailVerified,
      registrationMethod: 'manual',
      ...defaultNullData,
    });

    expect(res.body.tokens).toEqual({
      access: { token: expect.anything(), expires: expect.anything() },
      refresh: { token: expect.anything(), expires: expect.anything() },
    });

    const dbUser = User.findById(res.body.user.id);
    expect(dbUser).toBeDefined();
    expect(dbUser.password).not.toBe(loginCredentials.password);
  });

  // CASE user with its actual data
  test('should return 200 and user existing data if credentials are valid', async () => {
    const loginCredentials = {
      email: userThree.email,
      password: userThree.password,
    };
    await insertUsers([userThree]);

    const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.OK);

    const { _id, ...resetOfUserThreeData } = userThree;

    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).toEqual({
      ...resetOfUserThreeData,
      id: _id.toHexString(),
      registrationMethod: 'manual',
    });

    expect(res.body.tokens).toEqual({
      access: { token: expect.anything(), expires: expect.anything() },
      refresh: { token: expect.anything(), expires: expect.anything() },
    });

    const dbUser = await User.findById(res.body.user.id);
    expect(dbUser).toBeDefined();
    expect(dbUser.password).not.toBe(loginCredentials.password);
    const dbUserObject = dbUser.toObject();

    expect(dbUserObject).toMatchObject({ ...resetOfUserThreeData });
  });

  // CASE 401 -> passwrd wrong
  test('should return 401 Incorrect email or password if password is wrong', async () => {
    await insertUsers([userOne]);

    const loginCredentials = {
      email: userOne.email,
      password: 'wrongPass',
    };

    await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);
  });
  // CASE 401 -> email invalid
  test('should return 401 Incorrect email or password if email and password does not match', async () => {
    await insertUsers([userOne, userThree]);

    const loginCredentials = {
      email: userThree.email,
      password: userOne.password,
    };

    await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);
  });
  // CASE 404 -> email not found
  test('should return 404 Email not found if email does not exist', async () => {
    await insertUsers([userOne]);

    const loginCredentials = {
      email: 'noneExistingEmail',
      password: userOne.password,
    };

    await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.NOT_FOUND);
  });
});
