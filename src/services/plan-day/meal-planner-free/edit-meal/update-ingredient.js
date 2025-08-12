const updateIngredient = (macroGroup, ingIndex, ingredient, isAdd) => {
  const { singleLabel, multipleLabel, weightInGrams, nutrientFacts, breakpoint } = ingredient.serving;

  const ingToUpdate = macroGroup[ingIndex];
  const qtyChange = isAdd ? breakpoint : -breakpoint;

  // Calculate the change in macros based on serving size adjustment
  const macroDiff = {
    cal: nutrientFacts.cal * breakpoint,
    carb: nutrientFacts.carb * breakpoint,
    pro: nutrientFacts.pro * breakpoint,
    fat: nutrientFacts.fat * breakpoint,
  };

  // Adjust the quantity of the ingredient
  const newQty = ingToUpdate.portion.qty + qtyChange;

  // Case 1: Remove ingredient if quantity becomes zero or less
  if (newQty <= 0) {
    macroGroup.splice(ingIndex, 1);
    return macroDiff;
  }

  // Case 2: Update the macros and serving for existing ingredient
  ingToUpdate.macros = {
    cal: ingToUpdate.macros.cal + (isAdd ? macroDiff.cal : -macroDiff.cal),
    carb: ingToUpdate.macros.carb + (isAdd ? macroDiff.carb : -macroDiff.carb),
    pro: ingToUpdate.macros.pro + (isAdd ? macroDiff.pro : -macroDiff.pro),
    fat: ingToUpdate.macros.fat + (isAdd ? macroDiff.fat : -macroDiff.fat),
  };

  // Update serving details and weight
  ingToUpdate.portion = {
    label: {
      en: newQty >= 2 ? multipleLabel.en : singleLabel.en,
      ar: newQty >= 2 ? multipleLabel.ar : singleLabel.ar,
      fa: newQty >= 2 ? multipleLabel.fa : singleLabel.fa,
    },
    qty: newQty,
    weightInGrams: newQty * weightInGrams,
  };

  return macroDiff;
};

module.exports = updateIngredient;
