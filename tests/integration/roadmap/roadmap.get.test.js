const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../../../src/app');
const setupTestDB = require('../../utils/setupTestDB');
const { userOneAccessToken } = require('../../fixtures/token.fixture');
const { insertUsers, userOne } = require('../../fixtures/user.fixture');
const { insertRoadmaps, roadmapOne } = require('../../fixtures/roadmap.fixture');

setupTestDB();

describe('GET /v1/roadmaps/:roadmapId', () => {
  // CASE 200
  // test('should return 200 if roadmap exists', async () => {
  //   await insertUsers([userOne]);
  //   await insertRoadmaps([roadmapOne]);
  //   await request(app)
  //     .get(`/v1/roadmaps/${roadmapOne._id}`)
  //     .set('Authorization', `Bearer ${userOneAccessToken}`)
  //     .expect(httpStatus.OK);
  // });

  // CASE 400 invalid inputs
  test('should return 400 if roadmapId invalid', async () => {
    await insertUsers([userOne]);
    await insertRoadmaps([roadmapOne]);
    await request(app)
      .get(`/v1/roadmaps/${'invalidID'}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .expect(httpStatus.BAD_REQUEST);
  });

  // CASE 401 unauthorized
  test('should return 401 if token is invalid', async () => {
    await insertRoadmaps([roadmapOne]);
    await request(app)
      .get(`/v1/roadmaps/${roadmapOne._id}`)
      .set('Authorization', `invalidToken`)
      .expect(httpStatus.UNAUTHORIZED);
  });

  // CASE 404 user not found
  test('should return 404 if roadmap does not exists', async () => {
    await insertUsers([userOne]);
    await insertRoadmaps([roadmapOne]);

    await request(app)
      .get(`/v1/roadmaps/${mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .expect(httpStatus.NOT_FOUND);
  });
});
