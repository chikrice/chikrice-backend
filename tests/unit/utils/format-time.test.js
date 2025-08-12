const { fDate } = require('../../../src/utils/format-time');

describe('Utils unit tests', () => {
  test('should return correct date format', () => {
    const result = fDate(new Date().toISOString());

    console.log(result);
  });
});
