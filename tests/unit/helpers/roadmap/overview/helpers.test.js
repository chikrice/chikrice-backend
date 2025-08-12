const {
  calculateWeightProgression,
  generateWeightProgressRatios,
  calculateWeightChange,
} = require('../../../../../src/services/roadmap/overview/helpers');

describe('Roadmap Overview Helpers', () => {
  describe('calculateWeightChange', () => {
    it('should calculate weight change correctly for weight loss', () => {
      expect(calculateWeightChange(80, 70)).toBe(10);
    });

    it('should calculate weight change correctly for weight gain', () => {
      expect(calculateWeightChange(70, 80)).toBe(10);
    });

    it('should return 0 for same weights', () => {
      expect(calculateWeightChange(75, 75)).toBe(0);
    });
  });

  describe('generateWeightProgressRatios', () => {
    it('should generate correct ratios for 3 months', () => {
      const ratios = generateWeightProgressRatios(3);

      expect(ratios).toHaveLength(3);
      expect(ratios[0]).toBeGreaterThan(0);
      expect(ratios[2]).toBeCloseTo(1, 1);
      expect(ratios[1]).toBeGreaterThan(ratios[0]); // Middle month should be between
    });

    it('should generate correct ratios for 6 months', () => {
      const ratios = generateWeightProgressRatios(6);
      expect(ratios).toHaveLength(6);
      expect(ratios[0]).toBeGreaterThan(0);
      expect(ratios[5]).toBeCloseTo(1, 3);

      // Ratios should be monotonically increasing
      for (let i = 1; i < ratios.length; i++) {
        expect(ratios[i]).toBeGreaterThan(ratios[i - 1]);
      }
    });
  });

  describe('calculateWeightProgression', () => {
    const mockInput = {
      userId: '507f1f77bcf86cd799439011',
      age: 25,
      gender: 'male',
      height: 175,
      startWeight: 80,
      targetWeight: 70,
      activityLevel: 3,
      isWeightLifting: true,
      goalAchievementSpeed: 'recommended',
    };

    it('should handle small weight changes (≤2kg) correctly', () => {
      const smallChangeInput = {
        ...mockInput,
        startWeight: 75,
        targetWeight: 73,
      };

      const progression = calculateWeightProgression(smallChangeInput, 2, [0.5, 1]);

      expect(progression).toEqual([
        { month: 0, startWeight: 75, targetWeight: 75, weightChange: 0, changePoint: null },
        { month: 1, startWeight: 75, targetWeight: 73, weightChange: 2, changePoint: null },
      ]);
    });

    it('should calculate weight loss progression correctly', () => {
      const ratios = generateWeightProgressRatios(3);

      const progression = calculateWeightProgression(mockInput, 10, false, ratios);

      expect(progression).toHaveLength(4); // 0, 1, 2, 3 months
      expect(progression[0]).toEqual({
        month: 0,
        startWeight: 80,
        targetWeight: 80,
        changePoint: null,
        weightChange: 0,
      });

      // Check that weight decreases over time
      expect(progression[1].startWeight).toBe(80);
      expect(progression[1].targetWeight).toBe(75.7);
      expect(progression[1].weightChange).toBe(-4.3);
      expect(progression[3].targetWeight).toBe(70, 1);
    });

    it('should calculate weight gain progression correctly', () => {
      const gainInput = {
        ...mockInput,
        startWeight: 70,
        targetWeight: 80,
      };

      const ratios = generateWeightProgressRatios(3);
      const progression = calculateWeightProgression(gainInput, 10, true, ratios);

      expect(progression).toHaveLength(4);
      expect(progression[0]).toEqual({
        month: 0,
        startWeight: 70,
        targetWeight: 70,
        weightChange: 0,
        changePoint: null,
      });

      // Check that weight increases over time
      expect(progression[1].startWeight).toBe(70);
      expect(progression[1].targetWeight).toBe(74.3);
      expect(progression[1].weightChange).toBe(4.3);

      expect(progression[3].startWeight).toBe(77.7);
      expect(progression[3].targetWeight).toBe(80);
      expect(progression[3].weightChange).toBe(2.3);
    });

    it('should handle 6-month progression correctly', () => {
      const ratios = generateWeightProgressRatios(6);
      const progression = calculateWeightProgression(mockInput, 10, false, ratios);

      expect(progression).toHaveLength(7); // 0 through 6 months

      // Verify progression is smooth
      for (let i = 1; i < progression.length; i++) {
        expect(progression[i].targetWeight).toBeLessThan(progression[i - 1].targetWeight);
        expect(progression[i].weightChange).toBeLessThan(0); // Should be negative for weight loss
      }
    });

    it('should round weights to 2 decimal places', () => {
      const ratios = [0.3, 0.7, 1.0];
      const progression = calculateWeightProgression(mockInput, 10, true, ratios);

      // Check that all weights are properly rounded
      progression.forEach((month) => {
        const decimalPlaces = month.targetWeight.toString().split('.')[1]?.length || 0;
        expect(decimalPlaces).toBeLessThanOrEqual(2);
      });
    });

    it('should calculate weight changes correctly between months', () => {
      const ratios = [0.3, 0.7, 1.0];
      const progression = calculateWeightProgression(mockInput, 10, true, ratios);

      // First month: 0 weight change
      expect(progression[0].weightChange).toBe(0);

      // Subsequent months should have calculated weight changes
      for (let i = 1; i < progression.length; i++) {
        const expectedChange = progression[i].targetWeight - progression[i - 1].targetWeight;
        expect(progression[i].weightChange).toBeCloseTo(expectedChange, 2);
      }
    });
  });

  describe('Integration test - Full weight progression scenario', () => {
    it('should produce realistic weight progression for 3-month weight loss', () => {
      const input = {
        userId: '507f1f77bcf86cd799439011',
        age: 30,
        gender: 'female',
        height: 165,
        startWeight: 75,
        targetWeight: 65,
        activityLevel: 2,
        isWeightLifting: false,
        goalAchievementSpeed: 'slow',
      };

      const weightChange = calculateWeightChange(75, 65);
      const ratios = generateWeightProgressRatios(3);
      const progression = calculateWeightProgression(input, weightChange, false, ratios);

      // console.log('3-Month Weight Loss Progression:');
      // progression.forEach((month) => {
      //   console.log(
      //     `Month ${month.month}: ${month.targetWeight}kg (${month.weightChange > 0 ? '+' : ''}${month.weightChange}kg)`,
      //   );
      // });

      expect(progression).toHaveLength(4);
      expect(progression[0].targetWeight).toBe(75);
      expect(progression[3].targetWeight).toBe(65);
    });

    it('should produce realistic weight progression for 6-month weight gain', () => {
      const input = {
        userId: '507f1f77bcf86cd799439011',
        age: 25,
        gender: 'male',
        height: 180,
        startWeight: 70,
        targetWeight: 80,
        activityLevel: 4,
        isWeightLifting: true,
        goalAchievementSpeed: 'fast',
      };

      const weightChange = calculateWeightChange(70, 80);
      const ratios = generateWeightProgressRatios(6);
      const progression = calculateWeightProgression(input, weightChange, true, ratios);

      // console.log('6-Month Weight Gain Progression:');
      // progression.forEach((month) => {
      //   console.log(
      //     `Month ${month.month}: ${month.targetWeight}kg (${month.weightChange > 0 ? '+' : ''}${month.weightChange}kg)`,
      //   );
      // });

      expect(progression).toHaveLength(7);
      expect(progression[0].targetWeight).toBe(70);
      expect(progression[6].targetWeight).toBe(80);
    });

    it('should produce realistic weight progression for 6-month weight lose', () => {
      const input = {
        userId: '507f1f77bcf86cd799439011',
        age: 25,
        gender: 'male',
        height: 180,
        startWeight: 80,
        targetWeight: 68,
        activityLevel: 4,
        isWeightLifting: true,
        goalAchievementSpeed: 'Recommend',
      };

      const weightChange = calculateWeightChange(80, 68);
      const ratios = generateWeightProgressRatios(6);
      const progression = calculateWeightProgression(input, weightChange, false, ratios);

      // console.log('6-Month Weight Lose Progression:');
      // progression.forEach((month) => {
      //   console.log(
      //     `Month ${month.month}: ${month.targetWeight}kg (${month.weightChange > 0 ? '+' : ''}${month.weightChange}kg)`,
      //   );
      // });

      expect(progression).toHaveLength(7);
      expect(progression[0].targetWeight).toBe(80);
      expect(progression[6].targetWeight).toBe(68);
    });
  });
});
