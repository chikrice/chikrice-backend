const calcMealsAndSnacksCount = (calories) => {
  let mealsCount;
  let snacksCount;

  if (calories <= 1500) {
    mealsCount = 3;
    snacksCount = 1;
  } else if (calories <= 2500) {
    mealsCount = 3;
    snacksCount = 2;
  } else if (calories <= 3000) {
    mealsCount = 4;
    snacksCount = 2;
  } else if (calories <= 3500) {
    mealsCount = 4;
    snacksCount = 3;
  } else {
    mealsCount = 5;
    snacksCount = 3;
  }

  return { mealsCount, snacksCount };
};

module.exports = calcMealsAndSnacksCount;
