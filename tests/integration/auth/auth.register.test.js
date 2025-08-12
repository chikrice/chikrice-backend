const faker = require('faker');
const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../../../src/app');
const { User } = require('../../../src/models');
const setupTestDB = require('../../utils/setupTestDB');
const { insertUsers, userOne, defaultNullData } = require('../../fixtures/user.fixture');

setupTestDB();

// module.exports = () => {
describe('POST /v1/auth/register', () => {
  let newUser;
  beforeEach(() => {
    newUser = {
      name: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      password: 'password1',
      role: 'user',
    };
  });

  test('should return 201 and successfully register user with menimal data if request data is ok', async () => {
    const res = await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.CREATED);

    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).toEqual({
      id: expect.anything(),
      name: newUser.name,
      email: newUser.email,
      role: 'user',
      isEmailVerified: false,
      registrationMethod: 'manual',
      ...defaultNullData,
    });

    const dbUser = await User.findById(res.body.user.id);
    expect(dbUser).toBeDefined();
    expect(dbUser.password).not.toBe(newUser.password);
    expect(dbUser).toMatchObject({ name: newUser.name, email: newUser.email, role: 'user', isEmailVerified: false });

    expect(res.body.tokens).toEqual({
      access: { token: expect.anything(), expires: expect.anything() },
      refresh: { token: expect.anything(), expires: expect.anything() },
    });
  });

  test('should return 201 and successfully register user with essential data if request data is ok', async () => {
    const completeUser = {
      name: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      password: 'password1',
      role: 'user',
      age: faker.datatype.number({ min: 14, max: 100 }),
      gender: faker.helpers.randomize(['male', 'female']),
      startWeight: faker.datatype.number({ min: 40, max: 150 }),
      targetWeight: faker.datatype.number({ min: 40, max: 150 }),
      height: faker.datatype.number({ min: 80, max: 250 }),
      activityLevel: faker.datatype.number({ min: 1, max: 5 }),
      goalAchievementSpeed: faker.helpers.randomize(['slow', 'recommended', 'fast']),
      isWeightLifting: faker.datatype.boolean(),
    };

    const res = await request(app).post('/v1/auth/register').send(completeUser).expect(httpStatus.CREATED);
    expect(res.body.user).not.toHaveProperty('password');

    expect(res.body.user).toEqual({
      id: expect.anything(),
      ...defaultNullData,
      role: 'user',
      isEmailVerified: false,
      name: completeUser.name,
      email: completeUser.email,
      age: completeUser.age,
      startWeight: completeUser.startWeight,
      gender: completeUser.gender,
      height: completeUser.height,
      targetWeight: completeUser.targetWeight,
      activityLevel: completeUser.activityLevel,
      isWeightLifting: completeUser.isWeightLifting,
      goalAchievementSpeed: completeUser.goalAchievementSpeed,
      roadmapId: null,
      registrationMethod: 'manual',
    });

    expect(res.body.tokens).toEqual({
      access: { token: expect.anything(), expires: expect.anything() },
      refresh: { token: expect.anything(), expires: expect.anything() },
    });

    const dbUser = await User.findById(res.body.user.id);
    expect(dbUser).toBeDefined();
    expect(dbUser.password).not.toBe(newUser.password);
  });

  test('should return 400 error if email is invalid', async () => {
    newUser.email = 'invalidEmail';

    await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
  });

  test('should return 400 error if email is already used', async () => {
    await insertUsers([userOne]);
    newUser.email = userOne.email;

    await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
  });

  test('should return 400 error if password length is less than 8 characters', async () => {
    newUser.password = 'passwo1';

    await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
  });

  test('should return 400 error if password does not contain both letters and numbers', async () => {
    newUser.password = 'password';

    await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);

    newUser.password = '11111111';

    await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
  });
});
// };
