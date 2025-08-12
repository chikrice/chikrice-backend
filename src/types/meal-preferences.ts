export type IngredientPreference = {
  count: number;
  portionSize: number | null;
};

export type MacroTypePreferences = {
  [ingredientId: string]: IngredientPreference;
};

export type TimeSlotPreferences = {
  carb: MacroTypePreferences;
  pro: MacroTypePreferences;
  fat: MacroTypePreferences;
  free?: MacroTypePreferences;
};

export type MealPreferences = {
  [timeSlot: string]: TimeSlotPreferences;
};
