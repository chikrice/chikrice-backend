const calcMilestoneDates = require('../../../../src/services/roadmap/utils/calc-milestone-dates');

describe('SERVICES', () => {
  describe('Roadmap - calculate milestone dates', () => {
    test.each([
      {
        title: 'should calculate milestone dates for the first month',
        startDate: '2024-01-01T00:00:00.000Z',
        i: 1,
        expected: {
          milestoneStartDate: '2024-01-01T00:00:00.000Z',
          milestoneEndDate: '2024-02-01T00:00:00.000Z',
        },
      },
      {
        title: 'should calculate milestone dates for the third month',
        startDate: '2024-01-01T00:00:00.000Z',
        i: 3,
        expected: {
          milestoneStartDate: '2024-03-01T00:00:00.000Z',
          milestoneEndDate: '2024-04-01T00:00:00.000Z',
        },
      },
      {
        title: 'should handle leap years correctly',
        startDate: '2024-02-29T00:00:00.000Z',
        i: 1,
        expected: {
          milestoneStartDate: '2024-02-29T00:00:00.000Z',
          milestoneEndDate: '2024-03-29T00:00:00.000Z',
        },
      },
      {
        title: 'should calculate milestone dates correctly for the 12th month',
        startDate: '2024-01-01T00:00:00.000Z',
        i: 12,
        expected: {
          milestoneStartDate: '2024-12-01T00:00:00.000Z',
          milestoneEndDate: '2025-01-01T00:00:00.000Z',
        },
      },
      {
        title: 'should handle months correctly when start date is in the middle of the month',
        startDate: '2024-06-15T00:00:00.000Z',
        i: 1,
        expected: {
          milestoneStartDate: '2024-06-15T00:00:00.000Z',
          milestoneEndDate: '2024-07-15T00:00:00.000Z',
        },
      },
    ])('$title', ({ startDate, i, expected }) => {
      const result = calcMilestoneDates(startDate, i);
      expect(result.milestoneStartDate).toBe(expected.milestoneStartDate);
      expect(result.milestoneEndDate).toBe(expected.milestoneEndDate);
    });
  });
});
