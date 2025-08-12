const calcMacrosRatio = require('../../../../src/services/roadmap/utils/calc-macros-ratio');

describe('SERVICES', () => {
  describe('Roadmap calculate macros ratio', () => {
    // ------------------------ LOSE WEIGHT | MALE | NO GYM -------------------------------
    test('LoseWeight | male | noGym 3 months', () => {
      const totalMonths = 3;
      const gender = 'male';
      const isGainWeight = false;
      const isWeightLifting = false;

      const expectedResults = [
        { carb: 50, pro: 30, fat: 20 },
        { carb: 48, pro: 32, fat: 20 },
        { carb: 46, pro: 34, fat: 20 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }
      expect(results).toEqual(expectedResults);
    });

    test('LoseWeight | male | noGym 6 months', () => {
      const totalMonths = 6;
      const gender = 'male';
      const isGainWeight = false;
      const isWeightLifting = false;

      const expectedResults = [
        { carb: 50, pro: 30, fat: 20 },
        { carb: 48, pro: 32, fat: 20 },
        { carb: 46, pro: 34, fat: 20 },
        { carb: 44, pro: 36, fat: 20 },
        { carb: 42, pro: 38, fat: 20 },
        { carb: 40, pro: 40, fat: 20 },
      ];
      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }
      expect(results).toEqual(expectedResults);
    });

    test('LoseWeight | male | noGym 7 months', () => {
      const totalMonths = 7;
      const gender = 'male';
      const isGainWeight = false;
      const isWeightLifting = false;

      const expectedResults = [
        { carb: 50, pro: 30, fat: 20 },
        { carb: 48, pro: 32, fat: 20 },
        { carb: 47, pro: 33, fat: 20 },
        { carb: 45, pro: 35, fat: 20 },
        { carb: 44, pro: 36, fat: 20 },
        { carb: 42, pro: 38, fat: 20 },
        { carb: 40, pro: 40, fat: 20 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }
      expect(results).toEqual(expectedResults);
    });

    test('LoseWeight | male | noGym 9 months', () => {
      const totalMonths = 9;
      const gender = 'male';
      const isGainWeight = false;
      const isWeightLifting = false;

      const expectedResults = [
        { carb: 50, pro: 30, fat: 20 },
        { carb: 49, pro: 31, fat: 20 },
        { carb: 48, pro: 32, fat: 20 },
        { carb: 46, pro: 34, fat: 20 },
        { carb: 45, pro: 35, fat: 20 },
        { carb: 44, pro: 36, fat: 20 },
        { carb: 43, pro: 37, fat: 20 },
        { carb: 41, pro: 39, fat: 20 },
        { carb: 40, pro: 40, fat: 20 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }
      expect(results).toEqual(expectedResults);
    });

    // ------------------------ LOSE WEIGHT | FEMALE | NO GYM -------------------------------
    test('LoseWeight | female | noGym 3 months', () => {
      const totalMonths = 3;
      const gender = 'female';
      const isGainWeight = false;
      const isWeightLifting = false;

      const expectedResults = [
        { carb: 45, pro: 30, fat: 25 },
        { carb: 43, pro: 32, fat: 25 },
        { carb: 41, pro: 34, fat: 25 },
      ];
      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('LoseWeight | female | noGym 6 months', () => {
      const totalMonths = 6;
      const gender = 'female';
      const isGainWeight = false;
      const isWeightLifting = false;

      const expectedResults = [
        { carb: 45, pro: 30, fat: 25 },
        { carb: 43, pro: 32, fat: 25 },
        { carb: 41, pro: 34, fat: 25 },
        { carb: 39, pro: 36, fat: 25 },
        { carb: 37, pro: 38, fat: 25 },
        { carb: 35, pro: 40, fat: 25 },
      ];
      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }
      expect(results).toEqual(expectedResults);
    });

    test('LoseWeight | female | noGym 7 months', () => {
      const totalMonths = 7;
      const gender = 'female';
      const isGainWeight = false;
      const isWeightLifting = false;

      const expectedResults = [
        { carb: 45, pro: 30, fat: 25 },
        { carb: 43, pro: 32, fat: 25 },
        { carb: 42, pro: 33, fat: 25 },
        { carb: 40, pro: 35, fat: 25 },
        { carb: 39, pro: 36, fat: 25 },
        { carb: 37, pro: 38, fat: 25 },
        { carb: 35, pro: 40, fat: 25 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('LoseWeight | female | noGym 9 months', () => {
      const totalMonths = 9;
      const gender = 'female';
      const isGainWeight = false;
      const isWeightLifting = false;

      const expectedResults = [
        { carb: 45, pro: 30, fat: 25 },
        { carb: 44, pro: 31, fat: 25 },
        { carb: 43, pro: 32, fat: 25 },
        { carb: 41, pro: 34, fat: 25 },
        { carb: 40, pro: 35, fat: 25 },
        { carb: 39, pro: 36, fat: 25 },
        { carb: 38, pro: 37, fat: 25 },
        { carb: 36, pro: 39, fat: 25 },
        { carb: 35, pro: 40, fat: 25 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    // ------------------------ GAIN WEIGHT | MALE | NO GYM -------------------------------
    test('GainWeight | male | noGym 3 months', () => {
      const totalMonths = 3;
      const gender = 'male';
      const isGainWeight = true;
      const isWeightLifting = false;

      const expectedResults = [
        { carb: 50, pro: 30, fat: 20 },
        { carb: 52, pro: 28, fat: 20 },
        { carb: 54, pro: 26, fat: 20 },
      ];
      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('GainWeight | male | noGym 6 months', () => {
      const totalMonths = 6;
      const gender = 'male';
      const isGainWeight = true;
      const isWeightLifting = false;

      const expectedResults = [
        { carb: 50, pro: 30, fat: 20 },
        { carb: 52, pro: 28, fat: 20 },
        { carb: 54, pro: 26, fat: 20 },
        { carb: 56, pro: 24, fat: 20 },
        { carb: 58, pro: 22, fat: 20 },
        { carb: 60, pro: 20, fat: 20 },
      ];
      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('GainWeight | male | noGym 7 months', () => {
      const totalMonths = 7;
      const gender = 'male';
      const isGainWeight = true;
      const isWeightLifting = false;

      const expectedResults = [
        { carb: 50, pro: 30, fat: 20 },
        { carb: 52, pro: 28, fat: 20 },
        { carb: 53, pro: 27, fat: 20 },
        { carb: 55, pro: 25, fat: 20 },
        { carb: 56, pro: 24, fat: 20 },
        { carb: 58, pro: 22, fat: 20 },
        { carb: 60, pro: 20, fat: 20 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('GainWeight | male | noGym 9 months', () => {
      const totalMonths = 9;
      const gender = 'male';
      const isGainWeight = true;
      const isWeightLifting = false;

      const expectedResults = [
        { carb: 50, pro: 30, fat: 20 },
        { carb: 51, pro: 29, fat: 20 },
        { carb: 52, pro: 28, fat: 20 },
        { carb: 54, pro: 26, fat: 20 },
        { carb: 55, pro: 25, fat: 20 },
        { carb: 56, pro: 24, fat: 20 },
        { carb: 57, pro: 23, fat: 20 },
        { carb: 59, pro: 21, fat: 20 },
        { carb: 60, pro: 20, fat: 20 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    // ------------------------ GAIN WEIGHT | FEMALE | NO GYM -------------------------------
    test('GainWeight | female | noGym 3 months', () => {
      const totalMonths = 3;
      const gender = 'female';
      const isGainWeight = true;
      const isWeightLifting = false;

      const expectedResults = [
        { carb: 45, pro: 30, fat: 25 },
        { carb: 47, pro: 28, fat: 25 },
        { carb: 49, pro: 26, fat: 25 },
      ];
      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('GainWeight | female | noGym 6 months', () => {
      const totalMonths = 6;
      const gender = 'female';
      const isGainWeight = true;
      const isWeightLifting = false;

      const expectedResults = [
        { carb: 45, pro: 30, fat: 25 },
        { carb: 47, pro: 28, fat: 25 },
        { carb: 49, pro: 26, fat: 25 },
        { carb: 51, pro: 24, fat: 25 },
        { carb: 53, pro: 22, fat: 25 },
        { carb: 55, pro: 20, fat: 25 },
      ];
      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('GainWeight | female | noGym 7 months', () => {
      const totalMonths = 7;
      const gender = 'female';
      const isGainWeight = true;
      const isWeightLifting = false;

      const expectedResults = [
        { carb: 45, pro: 30, fat: 25 },
        { carb: 47, pro: 28, fat: 25 },
        { carb: 48, pro: 27, fat: 25 },
        { carb: 50, pro: 25, fat: 25 },
        { carb: 51, pro: 24, fat: 25 },
        { carb: 53, pro: 22, fat: 25 },
        { carb: 55, pro: 20, fat: 25 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('GainWeight | female | noGym 9 months', () => {
      const totalMonths = 9;
      const gender = 'female';
      const isGainWeight = true;
      const isWeightLifting = false;

      const expectedResults = [
        { carb: 45, pro: 30, fat: 25 },
        { carb: 46, pro: 29, fat: 25 },
        { carb: 47, pro: 28, fat: 25 },
        { carb: 49, pro: 26, fat: 25 },
        { carb: 50, pro: 25, fat: 25 },
        { carb: 51, pro: 24, fat: 25 },
        { carb: 52, pro: 23, fat: 25 },
        { carb: 54, pro: 21, fat: 25 },
        { carb: 55, pro: 20, fat: 25 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    // ------------------------ LOSE WEIGHT | MALE | GYM -------------------------------
    test('LoseWeight | male | gym 3 months', () => {
      const totalMonths = 3;
      const gender = 'male';
      const isGainWeight = false;
      const isWeightLifting = true;

      const expectedResults = [
        { carb: 45, pro: 35, fat: 20 },
        { carb: 43, pro: 37, fat: 20 },
        { carb: 41, pro: 39, fat: 20 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('LoseWeight | male | gym 6 months', () => {
      const totalMonths = 6;
      const gender = 'male';
      const isGainWeight = false;
      const isWeightLifting = true;

      const expectedResults = [
        { carb: 45, pro: 35, fat: 20 },
        { carb: 43, pro: 37, fat: 20 },
        { carb: 41, pro: 39, fat: 20 },
        { carb: 39, pro: 41, fat: 20 },
        { carb: 37, pro: 43, fat: 20 },
        { carb: 35, pro: 45, fat: 20 },
      ];
      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('LoseWeight | male | gym 7 months', () => {
      const totalMonths = 7;
      const gender = 'male';
      const isGainWeight = false;
      const isWeightLifting = true;

      const expectedResults = [
        { carb: 45, pro: 35, fat: 20 },
        { carb: 43, pro: 37, fat: 20 },
        { carb: 42, pro: 38, fat: 20 },
        { carb: 40, pro: 40, fat: 20 },
        { carb: 39, pro: 41, fat: 20 },
        { carb: 37, pro: 43, fat: 20 },
        { carb: 35, pro: 45, fat: 20 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('LoseWeight | male | gym 9 months', () => {
      const totalMonths = 9;
      const gender = 'male';
      const isGainWeight = false;
      const isWeightLifting = true;

      const expectedResults = [
        { carb: 45, pro: 35, fat: 20 },
        { carb: 44, pro: 36, fat: 20 },
        { carb: 43, pro: 37, fat: 20 },
        { carb: 41, pro: 39, fat: 20 },
        { carb: 40, pro: 40, fat: 20 },
        { carb: 39, pro: 41, fat: 20 },
        { carb: 38, pro: 42, fat: 20 },
        { carb: 36, pro: 44, fat: 20 },
        { carb: 35, pro: 45, fat: 20 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    // ------------------------ LOSE WEIGHT | FEMALE | GYM -------------------------------
    test('LoseWeight | female | gym 3 months', () => {
      const totalMonths = 3;
      const gender = 'female';
      const isGainWeight = false;
      const isWeightLifting = true;

      const expectedResults = [
        { carb: 45, pro: 30, fat: 25 },
        { carb: 43, pro: 32, fat: 25 },
        { carb: 41, pro: 34, fat: 25 },
      ];
      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('LoseWeight | female | gym 6 months', () => {
      const totalMonths = 6;
      const gender = 'female';
      const isGainWeight = false;
      const isWeightLifting = true;

      const expectedResults = [
        { carb: 45, pro: 30, fat: 25 },
        { carb: 43, pro: 32, fat: 25 },
        { carb: 41, pro: 34, fat: 25 },
        { carb: 39, pro: 36, fat: 25 },
        { carb: 37, pro: 38, fat: 25 },
        { carb: 35, pro: 40, fat: 25 },
      ];
      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('LoseWeight | female | gym 7 months', () => {
      const totalMonths = 7;
      const gender = 'female';
      const isGainWeight = false;
      const isWeightLifting = true;

      const expectedResults = [
        { carb: 45, pro: 30, fat: 25 },
        { carb: 43, pro: 32, fat: 25 },
        { carb: 42, pro: 33, fat: 25 },
        { carb: 40, pro: 35, fat: 25 },
        { carb: 39, pro: 36, fat: 25 },
        { carb: 37, pro: 38, fat: 25 },
        { carb: 30, pro: 45, fat: 25 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('LoseWeight | female | gym 9 months', () => {
      const totalMonths = 9;
      const gender = 'female';
      const isGainWeight = false;
      const isWeightLifting = true;

      const expectedResults = [
        { carb: 45, pro: 30, fat: 25 },
        { carb: 44, pro: 31, fat: 25 },
        { carb: 43, pro: 32, fat: 25 },
        { carb: 41, pro: 34, fat: 25 },
        { carb: 40, pro: 35, fat: 25 },
        { carb: 39, pro: 36, fat: 25 },
        { carb: 38, pro: 37, fat: 25 },
        { carb: 36, pro: 39, fat: 25 },
        { carb: 30, pro: 45, fat: 25 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    // ------------------------ GAIN WEIGHT | MALE | GYM -------------------------------
    test('GainWeight | male | gym 3 months', () => {
      const totalMonths = 3;
      const gender = 'male';
      const isGainWeight = true;
      const isWeightLifting = true;

      const expectedResults = [
        { carb: 45, pro: 35, fat: 20 },
        { carb: 47, pro: 33, fat: 20 },
        { carb: 49, pro: 31, fat: 20 },
      ];
      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('GainWeight | male | gym 6 months', () => {
      const totalMonths = 6;
      const gender = 'male';
      const isGainWeight = true;
      const isWeightLifting = true;

      const expectedResults = [
        { carb: 45, pro: 35, fat: 20 },
        { carb: 47, pro: 33, fat: 20 },
        { carb: 49, pro: 31, fat: 20 },
        { carb: 51, pro: 29, fat: 20 },
        { carb: 53, pro: 27, fat: 20 },
        { carb: 55, pro: 25, fat: 20 },
      ];
      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('GainWeight | male | gym 7 months', () => {
      const totalMonths = 7;
      const gender = 'male';
      const isGainWeight = true;
      const isWeightLifting = true;

      const expectedResults = [
        { carb: 45, pro: 35, fat: 20 },
        { carb: 47, pro: 33, fat: 20 },
        { carb: 48, pro: 32, fat: 20 },
        { carb: 50, pro: 30, fat: 20 },
        { carb: 51, pro: 29, fat: 20 },
        { carb: 53, pro: 27, fat: 20 },
        { carb: 55, pro: 25, fat: 20 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('GainWeight | male | gym 9 months', () => {
      const totalMonths = 9;
      const gender = 'male';
      const isGainWeight = true;
      const isWeightLifting = true;

      const expectedResults = [
        { carb: 45, pro: 35, fat: 20 },
        { carb: 46, pro: 34, fat: 20 },
        { carb: 47, pro: 33, fat: 20 },
        { carb: 49, pro: 31, fat: 20 },
        { carb: 50, pro: 30, fat: 20 },
        { carb: 51, pro: 29, fat: 20 },
        { carb: 52, pro: 28, fat: 20 },
        { carb: 54, pro: 26, fat: 20 },
        { carb: 55, pro: 25, fat: 20 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    // ------------------------ GAIN WEIGHT | FEMALE | GYM -------------------------------
    test('GainWeight | female gym 3 months', () => {
      const totalMonths = 3;
      const gender = 'female';
      const isGainWeight = true;
      const isWeightLifting = true;

      const expectedResults = [
        { carb: 40, pro: 35, fat: 25 },
        { carb: 42, pro: 33, fat: 25 },
        { carb: 44, pro: 31, fat: 25 },
      ];
      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('GainWeight | female | gym 6 months', () => {
      const totalMonths = 6;
      const gender = 'female';
      const isGainWeight = true;
      const isWeightLifting = true;

      const expectedResults = [
        { carb: 40, pro: 35, fat: 25 },
        { carb: 42, pro: 33, fat: 25 },
        { carb: 44, pro: 31, fat: 25 },
        { carb: 46, pro: 29, fat: 25 },
        { carb: 48, pro: 27, fat: 25 },
        { carb: 50, pro: 25, fat: 25 },
      ];
      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('GainWeight | female | gym 7 months', () => {
      const totalMonths = 7;
      const gender = 'female';
      const isGainWeight = true;
      const isWeightLifting = true;

      const expectedResults = [
        { carb: 40, pro: 35, fat: 25 },
        { carb: 42, pro: 33, fat: 25 },
        { carb: 43, pro: 32, fat: 25 },
        { carb: 45, pro: 30, fat: 25 },
        { carb: 46, pro: 29, fat: 25 },
        { carb: 48, pro: 27, fat: 25 },
        { carb: 50, pro: 25, fat: 25 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });

    test('GainWeight | female | gym 9 months', () => {
      const totalMonths = 9;
      const gender = 'female';
      const isGainWeight = true;
      const isWeightLifting = true;

      const expectedResults = [
        { carb: 40, pro: 35, fat: 25 },
        { carb: 41, pro: 34, fat: 25 },
        { carb: 42, pro: 33, fat: 25 },
        { carb: 44, pro: 31, fat: 25 },
        { carb: 45, pro: 30, fat: 25 },
        { carb: 46, pro: 29, fat: 25 },
        { carb: 47, pro: 28, fat: 25 },
        { carb: 49, pro: 26, fat: 25 },
        { carb: 50, pro: 25, fat: 25 },
      ];

      const results = [];
      for (let month = 1; month <= totalMonths; month++) {
        const result = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);
        results.push(result);
      }

      expect(results).toEqual(expectedResults);
    });
  });
});
