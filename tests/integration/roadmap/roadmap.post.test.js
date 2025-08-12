const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../../../src/app');
const { Roadmap } = require('../../../src/models');
const setupTestDB = require('../../utils/setupTestDB');
const { userOneAccessToken } = require('../../fixtures/token.fixture');
const { insertUsers, userOne } = require('../../fixtures/user.fixture');
const { roadmapOne, insertRoadmaps } = require('../../fixtures/roadmap.fixture');

setupTestDB();

describe('Roadmap Integration Tests', () => {
  const input = {
    startWeight: 77,
    targetWeight: 72,
    activityLevel: 3,
    gender: 'male',
    age: 27,
    height: 181,
    isWeightLifting: false,
    goalAchievementSpeed: 'recommended',
    userId: userOne._id.toString(),
  };

  it('should return 201 and return the generated roadmap for the user', async () => {
    await insertUsers([userOne]);

    const res = await request(app)
      .post('/v1/roadmaps')
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send(input)
      .expect(httpStatus.CREATED);

    const roadmap = res.body;

    const dbRoadmap = await Roadmap.findById(roadmap.id);

    expect(roadmap.userId.toString()).toBe(userOne._id.toString());
    expect(dbRoadmap).toBeDefined();
  });

  it('should return 400 if the input is invalid', async () => {
    await insertUsers([userOne]);
    input.startWeight = 'invalid';
    await request(app)
      .post('/v1/roadmaps')
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send(input)
      .expect(httpStatus.BAD_REQUEST);
  });

  it('should return 401 if the user is not authenticated', async () => {
    await request(app).post('/v1/roadmaps').send(input).expect(httpStatus.UNAUTHORIZED);
  });

  it('should return 200 and update the activity log', async () => {
    await insertUsers([userOne]);
    await insertRoadmaps([roadmapOne]);

    const data = {
      active: true,
      index: 0,
    };

    await request(app)
      .patch(`/v1/roadmaps/activity-log/${roadmapOne._id}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send(data)
      .expect(httpStatus.OK);

    const dbRoadmap = await Roadmap.findById(roadmapOne._id);
    expect(dbRoadmap.activityLog[0].active).toBe(true);
  });
});
