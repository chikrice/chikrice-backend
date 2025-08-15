const request = require('supertest');
const mongoose = require('mongoose');
const httpStatus = require('http-status');

const app = require('../../../src/app');
const { Roadmap } = require('../../../src/models');
const setupTestDB = require('../../utils/setupTestDB');
const { userOneAccessToken } = require('../../fixtures/token.fixture');
const { insertUsers, userOne } = require('../../fixtures/user.fixture');
const { insertRoadmaps, roadmapOne } = require('../../fixtures/roadmap.fixture');

setupTestDB();

describe('POST /v1/plans', () => {
  let roadmap;
  let milestoneId;

  beforeEach(async () => {
    // Insert test user
    await insertUsers([userOne]);

    // Create a roadmap with the test user
    const roadmapData = {
      ...roadmapOne,
      userId: userOne._id,
    };
    await insertRoadmaps([roadmapData]);

    // Get the created roadmap
    roadmap = await Roadmap.findOne({ userId: userOne._id });
    milestoneId = roadmap.milestones[0]._id.toString();
  });

  describe('success', () => {
    it('should create plans successfully with valid input', async () => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7); // 7 days from now

      const input = {
        roadmapId: roadmap._id.toString(),
        milestoneId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        macrosRatio: {
          carb: 45,
          pro: 35,
          fat: 20,
        },
        targetCalories: 2000,
      };

      const res = await request(app)
        .post('/v1/plans')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(input)
        .expect(httpStatus.CREATED);

      // Verify response structure
      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(8); // 7 days + 1 (inclusive)

      // Verify each plan structure
      res.body.forEach((plan, index) => {
        expect(plan).toHaveProperty('id');
        expect(plan).toHaveProperty('number', index + 1);
        expect(plan).toHaveProperty('mealsCount');
        expect(plan).toHaveProperty('snacksCount');
        expect(plan).toHaveProperty('name');
        expect(plan).toHaveProperty('date');
        expect(plan).toHaveProperty('targetMacros');
        expect(plan).toHaveProperty('consumedMacros');
        expect(plan).toHaveProperty('meals');

        // Verify target macros (in grams)
        expect(plan.targetMacros).toHaveProperty('cal', 2000);
        expect(plan.targetMacros).toHaveProperty('carb', 225); // (45% * 2000) / 4 = 225g
        expect(plan.targetMacros).toHaveProperty('pro', 175); // (35% * 2000) / 4 = 175g
        expect(plan.targetMacros).toHaveProperty('fat', 44); // (20% * 2000) / 9 = 44.44g ≈ 44g
      });

      // Verify roadmap was updated with plan references
      const updatedRoadmap = await Roadmap.findById(roadmap._id);
      const milestone = updatedRoadmap.milestones.find((m) => m._id.toString() === milestoneId);
      expect(milestone.plans).toHaveLength(8);

      milestone.plans.forEach((planRef, index) => {
        expect(planRef).toHaveProperty('plan');
        expect(planRef).toHaveProperty('name');
        expect(planRef).toHaveProperty('date');
        expect(planRef).toHaveProperty('number', index + 1);
        expect(planRef.plan.toString()).toBe(res.body[index].id);
      });
    });

    it('should create plans for a single day', async () => {
      const startDate = new Date();
      const endDate = new Date(); // Same as start date

      const input = {
        roadmapId: roadmap._id.toString(),
        milestoneId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        macrosRatio: {
          carb: 50,
          pro: 30,
          fat: 20,
        },
        targetCalories: 1800,
      };

      const res = await request(app)
        .post('/v1/plans')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(input)
        .expect(httpStatus.CREATED);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].targetMacros.cal).toBe(1800);
      expect(res.body[0].targetMacros.carb).toBe(225); // (50% * 1800) / 4 = 225g
      expect(res.body[0].targetMacros.pro).toBe(135); // (30% * 1800) / 4 = 135g
      expect(res.body[0].targetMacros.fat).toBe(40); // (20% * 1800) / 9 = 40g
    });
  });

  describe('validation', () => {
    it('should return 400 for invalid roadmapId', async () => {
      const input = {
        roadmapId: 'invalid-id',
        milestoneId,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        macrosRatio: { carb: 45, pro: 35, fat: 20 },
        targetCalories: 2000,
      };

      await request(app)
        .post('/v1/plans')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(input)
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should return 400 for invalid milestoneId', async () => {
      const input = {
        roadmapId: roadmap._id.toString(),
        milestoneId: 'invalid-milestone-id',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        macrosRatio: { carb: 45, pro: 35, fat: 20 },
        targetCalories: 2000,
      };

      await request(app)
        .post('/v1/plans')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(input)
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should return 400 for invalid date format', async () => {
      const input = {
        roadmapId: roadmap._id.toString(),
        milestoneId,
        startDate: 'invalid-date',
        endDate: new Date().toISOString(),
        macrosRatio: { carb: 45, pro: 35, fat: 20 },
        targetCalories: 2000,
      };

      await request(app)
        .post('/v1/plans')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(input)
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should return 400 for invalid macros ratio (sum not 100)', async () => {
      const input = {
        roadmapId: roadmap._id.toString(),
        milestoneId,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        macrosRatio: { carb: 50, pro: 30, fat: 30 }, // Sum = 110
        targetCalories: 2000,
      };

      await request(app)
        .post('/v1/plans')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(input)
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should return 400 for negative target calories', async () => {
      const input = {
        roadmapId: roadmap._id.toString(),
        milestoneId,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        macrosRatio: { carb: 45, pro: 35, fat: 20 },
        targetCalories: -100,
      };

      await request(app)
        .post('/v1/plans')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(input)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('error handling', () => {
    it('should return 404 for non-existent roadmap', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const input = {
        roadmapId: nonExistentId.toString(),
        milestoneId,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        macrosRatio: { carb: 45, pro: 35, fat: 20 },
        targetCalories: 2000,
      };

      await request(app)
        .post('/v1/plans')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(input)
        .expect(httpStatus.NOT_FOUND);
    });

    it('should return 404 for non-existent milestone', async () => {
      const nonExistentMilestoneId = new mongoose.Types.ObjectId();
      const input = {
        roadmapId: roadmap._id.toString(),
        milestoneId: nonExistentMilestoneId.toString(),
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        macrosRatio: { carb: 45, pro: 35, fat: 20 },
        targetCalories: 2000,
      };

      await request(app)
        .post('/v1/plans')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(input)
        .expect(httpStatus.NOT_FOUND);
    });

    it('should return 401 for missing authorization', async () => {
      const input = {
        roadmapId: roadmap._id.toString(),
        milestoneId,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        macrosRatio: { carb: 45, pro: 35, fat: 20 },
        targetCalories: 2000,
      };

      await request(app).post('/v1/plans').send(input).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('edge cases', () => {
    it('should handle end date before start date', async () => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - 1); // Yesterday

      const input = {
        roadmapId: roadmap._id.toString(),
        milestoneId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        macrosRatio: { carb: 45, pro: 35, fat: 20 },
        targetCalories: 2000,
      };

      await request(app)
        .post('/v1/plans')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(input)
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should handle very long date ranges', async () => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 365); // 1 year from now

      const input = {
        roadmapId: roadmap._id.toString(),
        milestoneId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        macrosRatio: { carb: 45, pro: 35, fat: 20 },
        targetCalories: 2000,
      };

      const res = await request(app)
        .post('/v1/plans')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(input)
        .expect(httpStatus.CREATED);

      expect(res.body).toHaveLength(366); // 365 days + 1 (inclusive)
    });
  });
});
