const calcWeightProgression = require('../../../../src/services/roadmap/calc-weight-progression');

const testCases = require('./weight-progression-results');

describe('SERVICES', () => {
  describe('Roadmap - calculate weight progression', () => {
    test('should match Khaled Javdan expected results', () => {
      const result = calcWeightProgression(74, 84, 10, 6);
      expect(result).toEqual(testCases[0].expectedResult);
    });

    test('should match Ali Gorzadin expected results', () => {
      const result = calcWeightProgression(60, 72, 12, 6);
      expect(result).toEqual(testCases[1].expectedResult);
    });
  });
});
