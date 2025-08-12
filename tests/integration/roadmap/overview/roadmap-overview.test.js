const { createRoadmapOverview } = require('../../../../src/services/roadmap/overview');

describe('Roadmap Overview Integration Tests', () => {
  describe('Create Roadmap Overview', () => {
    describe('Weight Loss Scenarios', () => {
      const weightLossInput = {
        startWeight: 77,
        targetWeight: 72,
        isWeightLifting: true,
        goalAchievementSpeed: 'recommended',
      };

      it('should create a valid roadmap overview for weight loss', () => {
        const overview = createRoadmapOverview(weightLossInput);

        expect(overview).toBeDefined();
        expect(overview.startWeight).toBe(77);
        expect(overview.targetWeight).toBe(72);
        expect(overview.totalDays).toBe(90);
        expect(overview.totalMonths).toBe(3);
        expect(overview.monthlyCalorieAdjustment).toEqual([-400, -500, -600]);
        expect(overview.startDate).toBeDefined();
        expect(overview.endDate).toBeDefined();
        expect(new Date(overview.endDate)).toBeInstanceOf(Date);
        expect(new Date(overview.startDate)).toBeInstanceOf(Date);
        expect(new Date(overview.endDate).getTime()).toBeGreaterThan(new Date(overview.startDate).getTime());
      });

      it('should handle aggressive weight loss speed', () => {
        const aggressiveInput = {
          ...weightLossInput,
          goalAchievementSpeed: 'fast',
        };

        const overview = createRoadmapOverview(aggressiveInput);

        expect(overview.totalDays).toBe(60);
        expect(overview.totalMonths).toBe(2);
        expect(overview.monthlyCalorieAdjustment).toEqual([-600, -700]);
      });

      it('should handle conservative weight loss speed', () => {
        const conservativeInput = {
          ...weightLossInput,
          goalAchievementSpeed: 'slow',
        };

        const overview = createRoadmapOverview(conservativeInput);

        expect(overview.totalDays).toBe(120);
        expect(overview.totalMonths).toBe(4);
        expect(overview.monthlyCalorieAdjustment).toEqual([-200, -300, -400, -500]);
      });
    });

    describe('Weight Gain Scenarios', () => {
      const weightGainInput = {
        startWeight: 65,
        targetWeight: 75,
        isWeightLifting: true,
        goalAchievementSpeed: 'recommended',
      };

      it('should create a valid roadmap overview for weight gain', () => {
        const overview = createRoadmapOverview(weightGainInput);

        expect(overview).toBeDefined();
        expect(overview.startWeight).toBe(65);
        expect(overview.targetWeight).toBe(75);
        expect(overview.totalDays).toBe(150);
        expect(overview.totalMonths).toBe(5);
        expect(overview.monthlyCalorieAdjustment).toEqual([400, 500, 600, 700, 800]);
        expect(overview.startDate).toBeDefined();
        expect(overview.endDate).toBeDefined();
      });

      it('should handle different weight lifting preferences', () => {
        const noWeightLiftingInput = {
          ...weightGainInput,
          isWeightLifting: false,
        };

        const overview = createRoadmapOverview(noWeightLiftingInput);

        expect(overview.totalDays).toBe(150);
        expect(overview.totalMonths).toBe(5);
        expect(overview.monthlyCalorieAdjustment).toEqual([400, 500, 600, 700, 800]);
      });
    });

    describe('Edge Cases and Validation', () => {
      it('should handle minimal weight change', () => {
        const minimalChangeInput = {
          startWeight: 70,
          targetWeight: 71,
          isWeightLifting: true,
          goalAchievementSpeed: 'recommended',
        };

        const overview = createRoadmapOverview(minimalChangeInput);

        expect(overview.totalDays).toBe(30);
        expect(overview.totalMonths).toBe(1);
        expect(overview.monthlyCalorieAdjustment).toEqual([400]);
      });

      it('should handle significant weight change', () => {
        const significantChangeInput = {
          startWeight: 60,
          targetWeight: 80,
          isWeightLifting: true,
          goalAchievementSpeed: 'recommended',
        };

        const overview = createRoadmapOverview(significantChangeInput);

        expect(overview.totalDays).toBe(240);
        expect(overview.totalMonths).toBe(8);
        expect(overview.monthlyCalorieAdjustment).toEqual([400, 500, 600, 700, 800, 900, 1000, 1100]);
      });
    });

    describe('Return Value Structure', () => {
      it('should return all required properties', () => {
        const input = {
          startWeight: 77,
          targetWeight: 72,
          isWeightLifting: true,
          goalAchievementSpeed: 'recommended',
        };

        const overview = createRoadmapOverview(input);

        // Check all expected properties exist
        const expectedProperties = [
          'startWeight',
          'targetWeight',
          'totalDays',
          'totalMonths',
          'monthlyCalorieAdjustment',
          'startDate',
          'endDate',
        ];

        expectedProperties.forEach((prop) => {
          expect(overview).toHaveProperty(prop);
          expect(overview[prop]).toBeDefined();
        });
      });

      it('should return proper data types', () => {
        const input = {
          startWeight: 77,
          targetWeight: 72,
          isWeightLifting: true,
          goalAchievementSpeed: 'recommended',
        };

        const overview = createRoadmapOverview(input);

        expect(typeof overview.startWeight).toBe('number');
        expect(typeof overview.targetWeight).toBe('number');
        expect(typeof overview.totalDays).toBe('number');
        expect(typeof overview.totalMonths).toBe('number');
        expect(Array.isArray(overview.monthlyCalorieAdjustment)).toBe(true);
        expect(typeof overview.startDate).toBe('object');
        expect(typeof overview.endDate).toBe('object');
      });
    });

    describe('Calculation Accuracy', () => {
      it('should provide consistent results for the same input', () => {
        const input = {
          startWeight: 77,
          targetWeight: 72,
          isWeightLifting: true,
          goalAchievementSpeed: 'recommended',
        };

        const overview1 = createRoadmapOverview(input);
        const overview2 = createRoadmapOverview(input);

        expect(overview1.totalDays).toBe(overview2.totalDays);
        expect(overview1.totalMonths).toBe(overview2.totalMonths);
        expect(overview1.monthlyCalorieAdjustment).toEqual(overview2.monthlyCalorieAdjustment);
      });
    });
  });
});
