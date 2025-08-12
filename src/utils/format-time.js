const { format } = require('date-fns');

const fDate = (date, newFormat) => {
  const fm = newFormat || 'dd-MM-yyyy';

  return date ? format(new Date(date), fm) : '';
};

module.exports = {
  fDate,
};
