const faker = require('faker');
const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../../../src/app');
const { User } = require('../../../src/models');
const setupTestDB = require('../../utils/setupTestDB');
const { adminAccessToken, userOneAccessToken } = require('../../fixtures/token.fixture');
const { insertUsers, admin, userOne, userTwo, defaultNullData } = require('../../fixtures/user.fixture');

setupTestDB();

describe('PATCH /v1/users/:userId', () => {
  // 200
  test('should return 200 and successfully update user if data is ok', async () => {
    await insertUsers([userOne]);

    const updateBody = {
      name: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      allergicFoods: ['fish'],
    };

    const res = await request(app)
      .patch(`/v1/users/${userOne._id}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send(updateBody)
      .expect(httpStatus.OK);

    expect(res.body).not.toHaveProperty('password');
    expect(res.body).toEqual({
      id: userOne._id.toHexString(),
      name: updateBody.name,
      email: updateBody.email,
      role: 'user',
      isEmailVerified: false,
      registrationMethod: 'manual',
      ...defaultNullData,
      allergicFoods: updateBody.allergicFoods,
    });
    expect(res.body.allergicFoods[0]).toBe(updateBody.allergicFoods[0]);

    const dbUser = await User.findById(userOne._id);
    expect(dbUser).toBeDefined();
    expect(dbUser.password).not.toBe(updateBody.password);
    expect(dbUser).toMatchObject({ name: updateBody.name, email: updateBody.email, role: 'user' });
  });

  // 200
  test('should return 200 and successfully update user if admin is updating another user', async () => {
    await insertUsers([userOne, admin]);
    const updateBody = { name: faker.name.findName() };

    await request(app)
      .patch(`/v1/users/${userOne._id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(updateBody)
      .expect(httpStatus.OK);
  });

  // 401
  test('should return 401 error if access token is missing', async () => {
    await insertUsers([userOne]);
    const updateBody = { name: faker.name.findName() };

    await request(app).patch(`/v1/users/${userOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
  });

  test('should return 403 if user is updating another user', async () => {
    await insertUsers([userOne, userTwo]);
    const updateBody = { name: faker.name.findName() };

    await request(app)
      .patch(`/v1/users/${userTwo._id}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send(updateBody)
      .expect(httpStatus.FORBIDDEN);
  });

  // 400
  test('should return 400 error if userId is not a valid mongo id', async () => {
    await insertUsers([admin]);
    const updateBody = { name: faker.name.findName() };

    await request(app)
      .patch(`/v1/users/invalidId`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(updateBody)
      .expect(httpStatus.BAD_REQUEST);
  });

  test('should return 400 if email is invalid', async () => {
    await insertUsers([userOne]);
    const updateBody = { email: 'invalidEmail' };

    await request(app)
      .patch(`/v1/users/${userOne._id}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send(updateBody)
      .expect(httpStatus.BAD_REQUEST);
  });

  test('should return 400 if email is already taken', async () => {
    await insertUsers([userOne, userTwo]);
    const updateBody = { email: userTwo.email };

    await request(app)
      .patch(`/v1/users/${userOne._id}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send(updateBody)
      .expect(httpStatus.BAD_REQUEST);
  });

  test('should not return 400 if email is my email', async () => {
    await insertUsers([userOne]);
    const updateBody = { email: userOne.email };

    await request(app)
      .patch(`/v1/users/${userOne._id}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send(updateBody)
      .expect(httpStatus.OK);
  });

  test('should return 400 if password length is less than 8 characters', async () => {
    await insertUsers([userOne]);
    const updateBody = { password: 'passwo1' };

    await request(app)
      .patch(`/v1/users/${userOne._id}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send(updateBody)
      .expect(httpStatus.BAD_REQUEST);
  });

  test('should return 400 if password does not contain both letters and numbers', async () => {
    await insertUsers([userOne]);
    const updateBody = { password: 'password' };

    await request(app)
      .patch(`/v1/users/${userOne._id}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send(updateBody)
      .expect(httpStatus.BAD_REQUEST);

    updateBody.password = '11111111';

    await request(app)
      .patch(`/v1/users/${userOne._id}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send(updateBody)
      .expect(httpStatus.BAD_REQUEST);
  });

  // 401
  test('should return 404 if admin is updating another user that is not found', async () => {
    await insertUsers([admin]);
    const updateBody = { name: faker.name.findName() };

    await request(app)
      .patch(`/v1/users/${userOne._id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(updateBody)
      .expect(httpStatus.NOT_FOUND);
  });
});
