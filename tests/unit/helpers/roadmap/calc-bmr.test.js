const calcBMR = require('../../../../src/services/roadmap/utils/calc-bmr');

describe('SERVICES', () => {
  describe('Roadmap - calcBMR', () => {
    test.each([
      {
        desc: 'male with given weight, height, and age',
        weight: 70,
        height: 175,
        age: 25,
        gender: 'male',
        expected: 1673.75,
      },
      {
        desc: 'female with given weight, height, and age',
        weight: 60,
        height: 160,
        age: 30,
        gender: 'female',
        expected: 1289,
      },
      {
        desc: 'female with minimal values for weight, height, and age',
        weight: 30,
        height: 140,
        age: 18,
        gender: 'female',
        expected: 924,
      },
      {
        desc: 'male with height in centimeters and weight in kilograms',
        weight: 85,
        height: 190,
        age: 35,
        gender: 'male',
        expected: 1867.5,
      },
      {
        desc: 'female with non-integer values for weight, height, and age',
        weight: 72.5,
        height: 168.5,
        age: 29.5,
        gender: 'female',
        expected: 1469.625,
      },
    ])('should calculate BMR for $desc', ({ weight, height, age, gender, expected }) => {
      const result = calcBMR(weight, height, age, gender);

      expect(result).toBe(expected);
    });
  });
});
