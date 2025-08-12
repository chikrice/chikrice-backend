const faker = require('faker');
const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../../../src/app');
const setupTestDB = require('../../utils/setupTestDB');
const { User, Admin } = require('../../../src/models');
const { adminAccessToken, userOneAccessToken } = require('../../fixtures/token.fixture');
const { insertUsers, admin, userOne, defaultNullData } = require('../../fixtures/user.fixture');

setupTestDB();

describe('POST /v1/users', () => {
  let newUser;

  beforeEach(() => {
    newUser = {
      name: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      password: 'password1',
      role: 'user',
    };
  });

  test('should return 201 and successfuly create new user with default values', async () => {
    await insertUsers([admin]);

    const res = await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(newUser)
      .expect(httpStatus.CREATED);

    expect(res.body).not.toHaveProperty('password');
    expect(res.body).toEqual({
      id: expect.anything(),
      name: newUser.name,
      email: newUser.email,
      role: 'user',
      isEmailVerified: false,
      registrationMethod: 'manual',
      ...defaultNullData,
    });

    const dbUser = await User.findById(res.body.id).lean();
    expect(dbUser).toBeDefined();
    expect(dbUser.password).not.toBe(newUser.password);
    expect(dbUser).toMatchObject({
      name: newUser.name,
      email: newUser.email,
      role: 'user',
      isEmailVerified: false,
      ...defaultNullData,
    });
  });

  test('should return 201 and create new admin user without default values', async () => {
    await insertUsers([admin]);
    newUser.role = 'admin';

    const res = await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(newUser)
      .expect(httpStatus.CREATED);

    expect(res.body).toEqual({
      id: expect.anything(),
      name: newUser.name,
      email: newUser.email,
      role: 'admin',
      isEmailVerified: false,
      age: null,
      gender: null,
      phoneNumber: null,
      picture: null,
      registrationMethod: 'manual',
    });

    const dbUser = await Admin.findById(res.body.id).lean();
    expect(dbUser.role).toBe('admin');
    expect(dbUser).toMatchObject({
      name: newUser.name,
      email: newUser.email,
      role: 'admin',
      isEmailVerified: false,
    });
  });

  test('should return 400 error if the user email is invalid', async () => {
    insertUsers([admin]);
    newUser.email = 'invalidEmail';

    await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(newUser)
      .expect(httpStatus.BAD_REQUEST);
  });

  test('should return 400 error if user email is taken', async () => {
    await insertUsers([admin, userOne]);
    newUser.email = userOne.email;

    await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(newUser)
      .expect(httpStatus.BAD_REQUEST);
  });

  test('should return 400 error if user password is less then 8 charachters', async () => {
    await insertUsers([admin]);
    newUser.password = 'pass1';

    await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(newUser)
      .expect(httpStatus.BAD_REQUEST);
  });
  test('should return 400 error if user password does not contain charachter', async () => {
    await insertUsers([admin]);
    newUser.password = 'password';

    await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(newUser)
      .expect(httpStatus.BAD_REQUEST);
  });

  test('should return 400 error if user role is not one of user or admin', async () => {
    await insertUsers([admin]);
    newUser.role = 'other';

    await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(newUser)
      .expect(httpStatus.BAD_REQUEST);
  });

  test('should return 401 error if accessToken is missing', async () => {
    await request(app).post('/v1/users').send(newUser).expect(httpStatus.UNAUTHORIZED);
  });

  test('should return 403 error if user logged in is user and not admin', async () => {
    await insertUsers([userOne]);

    await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send(newUser)
      .expect(httpStatus.FORBIDDEN);
  });
});
