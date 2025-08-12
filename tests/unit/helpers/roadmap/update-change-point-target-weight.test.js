const updateChangePointTargetWeight = require('../../../../src/services/roadmap/utils/update-change-point-target-weight');

// TODO: Enable this test when the updateChangePointTargetWeight feature is implemented
describe.skip('SERVICES Roadmap', () => {
  describe('UpdateChangePointTargetWeight', () => {
    test('should return correct new target weight for mandatory inputs', () => {
      const leftDays = 10;
      const startWeight = 72;
      const onGoingMonth = 3;
      const oldTotalMonths = 6;
      const newStartWeight = 75;
      const oldTargetWeight = 84;
      const newTargetWeightInput = 84;
      const goalAchievementSpeed = 'recommended';

      const result = updateChangePointTargetWeight(
        leftDays,
        startWeight,
        onGoingMonth,
        oldTotalMonths,
        newStartWeight,
        oldTargetWeight,
        newTargetWeightInput,
        goalAchievementSpeed,
      );

      expect(result).toBe(75.6);
    });
  });
});
