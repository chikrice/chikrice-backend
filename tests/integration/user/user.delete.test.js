const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../../../src/app');
const { User } = require('../../../src/models');
const setupTestDB = require('../../utils/setupTestDB');
const { insertUsers, admin, userOne } = require('../../fixtures/user.fixture');
const { adminAccessToken, userOneAccessToken } = require('../../fixtures/token.fixture');

setupTestDB();

describe('DELETE /v1/users/:userId', () => {
  // 204 user deletes
  test('should return 204 if data is ok', async () => {
    await insertUsers([userOne]);

    await request(app)
      .delete(`/v1/users/${userOne._id}`)
      .set(`Authorization`, `Bearer ${userOneAccessToken}`)
      .send()
      .expect(httpStatus.NO_CONTENT);

    const dbUser = await User.findById(userOne._id);
    expect(dbUser).toBeNull();
  });

  // 204 admin deletes user
  test('should return 204 if admin is trying to delete another user', async () => {
    await insertUsers([userOne, admin]);

    await request(app)
      .delete(`/v1/users/${userOne._id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send()
      .expect(httpStatus.NO_CONTENT);

    const dbUser = await User.findById(userOne._id);
    expect(dbUser).toBeNull();
  });

  // 401
  test('should return 401 error if access token is missing', async () => {
    await insertUsers([userOne]);

    await request(app).delete(`/v1/users/${userOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
  });
  // 400
  test('should return 400 error if userId is not a valid mongo id', async () => {
    await insertUsers([admin]);

    await request(app)
      .delete('/v1/users/invalidId')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send()
      .expect(httpStatus.BAD_REQUEST);
  });
  // 404
  test('should return 404 error if user already is not found', async () => {
    await insertUsers([admin]);

    await request(app)
      .delete(`/v1/users/${userOne._id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send()
      .expect(httpStatus.NOT_FOUND);
  });
});
