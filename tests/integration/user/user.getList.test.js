const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../../../src/app');
const setupTestDB = require('../../utils/setupTestDB');
const { adminAccessToken, userOneAccessToken } = require('../../fixtures/token.fixture');
const { insertUsers, admin, userOne, userTwo, defaultNullData } = require('../../fixtures/user.fixture');

setupTestDB();

describe('GET /v1/users', () => {
  test('should return 200 and apply the default query options', async () => {
    await insertUsers([userOne, userTwo, admin]);

    const res = await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send()
      .expect(httpStatus.OK);

    expect(res.body).toEqual({
      results: expect.any(Array),
      page: 1,
      limit: 10,
      totalPages: 1,
      totalResults: 3,
    });
    expect(res.body.results).toHaveLength(3);
    expect(res.body.results[0]).toEqual({
      id: userOne._id.toHexString(),
      name: userOne.name,
      email: userOne.email,
      role: userOne.role,
      isEmailVerified: userOne.isEmailVerified,
      registrationMethod: 'manual',
      ...defaultNullData,
    });
  });

  test('should return 401 if accessToken is missing', async () => {
    await insertUsers([userOne, userTwo, admin]);

    await request(app).get('/v1/users').send().expect(httpStatus.UNAUTHORIZED);
  });

  test('should return 403 if a non-admin is trying to access all users', async () => {
    await insertUsers([userOne, userTwo, admin]);

    await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send()
      .expect(httpStatus.FORBIDDEN);
  });
  test('should correctly apply filter on name field', async () => {
    await insertUsers([userOne, userTwo, admin]);

    const res = await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ name: userOne.name })
      .send()
      .expect(httpStatus.OK);

    expect(res.body).toEqual({
      results: expect.any(Array),
      page: 1,
      limit: 10,
      totalPages: 1,
      totalResults: 1,
    });
    expect(res.body.results).toHaveLength(1);
    expect(res.body.results[0].id).toBe(userOne._id.toHexString());
  });

  test('should correctly apply filter on role', async () => {
    await insertUsers([userOne, userTwo, admin]);

    const res = await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ role: 'user' })
      .send()
      .expect(httpStatus.OK);

    expect(res.body).toEqual({
      results: expect.any(Array),
      page: 1,
      limit: 10,
      totalPages: 1,
      totalResults: 2,
    });
    expect(res.body.results).toHaveLength(2);
    expect(res.body.results[0].id).toBe(userOne._id.toHexString());
    expect(res.body.results[1].id).toBe(userTwo._id.toHexString());
  });

  test('should correctly sort the returned array if descending sort param is specified', async () => {
    await insertUsers([userOne, userTwo, admin]);

    const res = await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ sortBy: 'role:desc' })
      .send()
      .expect(httpStatus.OK);

    expect(res.body).toEqual({
      results: expect.any(Array),
      page: 1,
      limit: 10,
      totalPages: 1,
      totalResults: 3,
    });
    expect(res.body.results).toHaveLength(3);
    expect(res.body.results[0].id).toBe(userOne._id.toHexString());
    expect(res.body.results[1].id).toBe(userTwo._id.toHexString());
    expect(res.body.results[2].id).toBe(admin._id.toHexString());
  });

  test('should correctlyl sort the returned array if acending sort param is specified', async () => {
    await insertUsers([userOne, userTwo, admin]);

    const res = await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ sortBy: 'role:asc' })
      .send()
      .expect(httpStatus.OK);

    expect(res.body).toEqual({
      results: expect.any(Array),
      page: 1,
      limit: 10,
      totalPages: 1,
      totalResults: 3,
    });
    expect(res.body.results).toHaveLength(3);
    expect(res.body.results[0].id).toBe(admin._id.toHexString());
    expect(res.body.results[1].id).toBe(userOne._id.toHexString());
    expect(res.body.results[2].id).toBe(userTwo._id.toHexString());
  });

  test('should correctlyl sort the returned array if combined acending sort param is specified', async () => {
    await insertUsers([userOne, userTwo, admin]);

    const res = await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ sortBy: 'role:desc,name:asc' })
      .send()
      .expect(httpStatus.OK);

    expect(res.body).toEqual({
      results: expect.any(Array),
      page: 1,
      limit: 10,
      totalPages: 1,
      totalResults: 3,
    });
    expect(res.body.results).toHaveLength(3);

    const expectedOrder = [userOne, userTwo, admin].sort((a, b) => {
      if (a.role < b.role) return 1;
      if (a.role > b.role) return -1;
      return a.name < b.name ? -1 : 1;
    });

    expectedOrder.forEach((user, index) => {
      expect(res.body.results[index].id).toBe(user._id.toHexString());
    });
  });

  test('should limit returned array if limit param is specified', async () => {
    await insertUsers([userOne, userTwo, admin]);

    const res = await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ limit: 2 })
      .send()
      .expect(httpStatus.OK);

    expect(res.body).toEqual({
      results: expect.any(Array),
      page: 1,
      limit: 2,
      totalPages: 2,
      totalResults: 3,
    });
    expect(res.body.results).toHaveLength(2);
    expect(res.body.results[0].id).toBe(userOne._id.toHexString());
    expect(res.body.results[1].id).toBe(userTwo._id.toHexString());
  });

  test('should return the correct page if page and limit params are specified', async () => {
    await insertUsers([userOne, userTwo, admin]);

    const res = await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ page: 2, limit: 2 })
      .send()
      .expect(httpStatus.OK);

    expect(res.body).toEqual({
      results: expect.any(Array),
      page: 2,
      limit: 2,
      totalPages: 2,
      totalResults: 3,
    });
    expect(res.body.results).toHaveLength(1);
    expect(res.body.results[0].id).toBe(admin._id.toHexString());
  });
});
