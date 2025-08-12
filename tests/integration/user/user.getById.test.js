const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../../../src/app');
const setupTestDB = require('../../utils/setupTestDB');
const { adminAccessToken, userOneAccessToken, userThreeAccessToken } = require('../../fixtures/token.fixture');
const { insertUsers, admin, userOne, userTwo, defaultNullData, userThree } = require('../../fixtures/user.fixture');

setupTestDB();

describe('GET /v1/users/:userId', () => {
  test('should return 200 and the user object with user data and default initialization', async () => {
    await insertUsers([userOne]);

    const res = await request(app)
      .get(`/v1/users/${userOne._id}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send()
      .expect(httpStatus.OK);

    expect(res.body).not.toHaveProperty('password');
    expect(res.body).toEqual({
      id: userOne._id.toHexString(),
      email: userOne.email,
      name: userOne.name,
      role: userOne.role,
      isEmailVerified: userOne.isEmailVerified,
      registrationMethod: 'manual',
      ...defaultNullData,
    });
  });

  test('should return 200 and the user object with user data', async () => {
    await insertUsers([userThree]);

    const res = await request(app)
      .get(`/v1/users/${userThree._id}`)
      .set('Authorization', `Bearer ${userThreeAccessToken}`)
      .send()
      .expect(httpStatus.OK);

    expect(res.body).not.toHaveProperty('password');
    expect(res.body).toEqual({
      id: userThree._id.toHexString(),
      email: userThree.email,
      name: userThree.name,
      role: userThree.role,
      isEmailVerified: userThree.isEmailVerified,
      age: userThree.age,
      startWeight: userThree.startWeight,
      gender: userThree.gender,
      height: userThree.height,
      picture: userThree.picture,
      addressBook: [],
      allergicFoods: [],
      currentCoach: null,
      currentWeight: null,
      roadmapId: null,
      savedPlans: [],
      phoneNumber: userThree.phoneNumber,
      targetWeight: userThree.targetWeight,
      activityLevel: userThree.activityLevel,
      isWeightLifting: userThree.isWeightLifting,
      goalAchievementSpeed: userThree.goalAchievementSpeed,
      registrationMethod: 'manual',
    });
  });

  test('should return 200 and the user object if admin is trying to get another user', async () => {
    await insertUsers([userOne, admin]);

    await request(app)
      .get(`/v1/users/${userOne._id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send()
      .expect(httpStatus.OK);
  });

  test('should return 401 error if access token is missing', async () => {
    await insertUsers([userOne]);

    await request(app).get(`/v1/users/${userOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
  });

  test('should return 403 error if user is trying to get another user', async () => {
    await insertUsers([userOne, userTwo]);

    await request(app)
      .get(`/v1/users/${userTwo._id}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send()
      .expect(httpStatus.FORBIDDEN);
  });

  test('should return 400 error if userId is not a valid mongo id', async () => {
    await insertUsers([admin]);

    await request(app)
      .get('/v1/users/invalidId')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send()
      .expect(httpStatus.BAD_REQUEST);
  });

  test('should return 404 error if user is not found', async () => {
    await insertUsers([admin]);

    await request(app)
      .get(`/v1/users/${userOne._id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send()
      .expect(httpStatus.NOT_FOUND);
  });
});
