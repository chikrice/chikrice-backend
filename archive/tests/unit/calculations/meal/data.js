const carbLimit = { min: 20, max: 70 };
const proLimit = { min: 20, max: 70 };
const fatLimit = { min: 5, max: 20 };

const carbIngredients = [
  {
    ratio: 0.7,
    ingredient: {
      serving: {
        singleLabel: {
          en: 'cup',
          ar: 'كوب',
        },
        multipleLabel: {
          en: 'cups',
          ar: 'أكواب',
        },
        weightInGrams: 80,
        nutrientFacts: {
          carb: 54,
          pro: 3.3,
          fat: 1.5,
          cal: 307,
        },
        breakpoint: 0.25,
      },
      prepType: 'none',
      isCountable: false,
      isRaw: true,
      icon: '🌾',
      name: {
        en: 'Oats',
        ar: 'شوفان',
      },
      type: 'carb',
      category: 'grains',
    },
  },
  {
    ratio: 0.3,
    ingredient: {
      serving: {
        singleLabel: {
          en: 'cup',
          ar: 'كوب',
        },
        multipleLabel: {
          en: 'cups',
          ar: 'أكواب',
        },
        weightInGrams: 244,
        nutrientFacts: {
          carb: 12,
          pro: 8,
          fat: 8,
          cal: 146,
        },
        breakpoint: 0.5,
      },
      prepType: 'none',
      isCountable: true,
      isRaw: false,
      name: {
        en: 'Milk',
        ar: 'حليب',
      },
      icon: '🥛',
      type: 'carb',
      category: 'dairy',
    },
  },
];

const proIngredients = [
  {
    ratio: 0.4,
    ingredient: {
      serving: {
        singleLabel: {
          en: 'medium egg',
          ar: 'بيضة متوسطة',
        },
        multipleLabel: {
          en: 'medium eggs',
          ar: 'بیضات متوسطات',
        },
        weightInGrams: 50,
        nutrientFacts: {
          carb: 0.6,
          pro: 6.5,
          fat: 5,
          cal: 68,
        },
        breakpoint: 1,
      },
      prepType: 'none',
      isCountable: true,
      isRaw: true,
      icon: '🍳',
      name: {
        en: 'Egg',
        ar: 'بيضة',
      },
      type: 'pro',
      category: 'proteins',
    },
  },
  {
    ratio: 0.6,
    ingredient: {
      serving: {
        singleLabel: {
          en: 'egg',
          ar: 'بيضة',
        },
        multipleLabel: {
          en: 'eggs',
          ar: 'بياضات',
        },
        weightInGrams: 33,
        nutrientFacts: {
          carb: 0.3,
          pro: 3.6,
          fat: 0.1,
          cal: 17,
        },
        breakpoint: 1,
      },
      prepType: 'none',
      isCountable: false,
      isRaw: true,
      icon: '🥚',
      name: {
        en: 'Egg White',
        ar: 'بياض البيض',
      },
      type: 'pro',
      category: 'proteins',
    },
  },
];

const fatIngredietns = [
  {
    ratio: 1,
    ingredient: {
      serving: {
        singleLabel: {
          en: 'tablespoon',
          ar: 'ملعقة كبيرة',
        },
        multipleLabel: {
          en: 'tablespoons',
          ar: 'ملاعق كبيرة',
        },
        weightInGrams: 15,
        nutrientFacts: {
          carb: 2.5,
          pro: 2.5,
          fat: 5,
          cal: 60,
        },
        breakpoint: 1,
      },
      prepType: 'none',
      isCountable: false,
      isRaw: false,
      icon: '🧀',
      name: {
        en: 'Lebnah',
        ar: 'لبنة',
      },
      type: 'fat',
      category: 'dairy',
    },
  },
];

const combo = {
  mealNumbers: [1],
  ingredients: {
    carb: [
      {
        ratio: 0.7,
        ingredient: {
          serving: {
            singleLabel: {
              en: 'cup',
              ar: 'كوب',
            },
            multipleLabel: {
              en: 'cups',
              ar: 'أكواب',
            },
            weightInGrams: 80,
            nutrientFacts: {
              carb: 54,
              pro: 3.3,
              fat: 1.5,
              cal: 307,
            },
            breakpoint: 0.25,
          },
          prepType: 'none',
          isCountable: false,
          isRaw: true,
          icon: '🌾',
          name: {
            en: 'Oats',
            ar: 'شوفان',
          },
          type: 'carb',
          category: 'grains',
        },
      },
      {
        ratio: 0.3,
        ingredient: {
          serving: {
            singleLabel: {
              en: 'cup',
              ar: 'كوب',
            },
            multipleLabel: {
              en: 'cups',
              ar: 'أكواب',
            },
            weightInGrams: 244,
            nutrientFacts: {
              carb: 12,
              pro: 8,
              fat: 8,
              cal: 146,
            },
            breakpoint: 0.5,
          },
          prepType: 'none',
          isCountable: true,
          isRaw: false,
          name: {
            en: 'Milk',
            ar: 'حليب',
          },
          icon: '🥛',
          type: 'carb',
          category: 'dairy',
        },
      },
    ],
    pro: [
      {
        ratio: 0.4,
        ingredient: {
          serving: {
            singleLabel: {
              en: 'medium egg',
              ar: 'بيضة متوسطة',
            },
            multipleLabel: {
              en: 'medium eggs',
              ar: 'بیضات متوسطات',
            },
            weightInGrams: 50,
            nutrientFacts: {
              carb: 0.6,
              pro: 6.5,
              fat: 5,
              cal: 68,
            },
            breakpoint: 1,
          },
          prepType: 'none',
          isCountable: true,
          isRaw: true,
          icon: '🍳',
          name: {
            en: 'Egg',
            ar: 'بيضة',
          },
          type: 'pro',
          category: 'proteins',
        },
      },
      {
        ratio: 0.6,
        ingredient: {
          serving: {
            singleLabel: {
              en: 'egg',
              ar: 'بيضة',
            },
            multipleLabel: {
              en: 'eggs',
              ar: 'بياضات',
            },
            weightInGrams: 33,
            nutrientFacts: {
              carb: 0.3,
              pro: 3.6,
              fat: 0.1,
              cal: 17,
            },
            breakpoint: 1,
          },
          prepType: 'none',
          isCountable: false,
          isRaw: true,
          icon: '🥚',
          name: {
            en: 'Egg White',
            ar: 'بياض البيض',
          },
          type: 'pro',
          category: 'proteins',
        },
      },
    ],
    fat: [
      {
        ratio: 1,
        ingredient: {
          serving: {
            singleLabel: {
              en: 'tablespoon',
              ar: 'ملعقة كبيرة',
            },
            multipleLabel: {
              en: 'tablespoons',
              ar: 'ملاعق كبيرة',
            },
            weightInGrams: 15,
            nutrientFacts: {
              carb: 2.5,
              pro: 2.5,
              fat: 5,
              cal: 60,
            },
            breakpoint: 1,
          },
          prepType: 'none',
          isCountable: false,
          isRaw: false,
          icon: '🧀',
          name: {
            en: 'Lebnah',
            ar: 'لبنة',
          },
          type: 'fat',
          category: 'dairy',
        },
      },
    ],
  },
  tasteAdditions: [],
  extraInfo: 'Veggies are allowed',
  type: 'meal',
};

module.exports = {
  carbLimit,
  proLimit,
  fatLimit,
  carbIngredients,
  proIngredients,
  fatIngredietns,
  combo,
};
