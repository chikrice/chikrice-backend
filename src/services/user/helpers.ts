import 'openai/shims/node';
import { z } from 'zod';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';

import config from '@/config/config';

import type { UserIngredientType } from 'chikrice-types';
import type { AddUserCustomIngredientDTO } from '@/validations/user.validation';

const aiResponseFormat = z.object({
  name: z.object({
    en: z.string(),
    ar: z.string(),
    fa: z.string(),
  }),
  icon: z.string(),
  singleLabel: z.object({
    en: z.string(),
    ar: z.string(),
    fa: z.string(),
  }),
  multipleLabel: z.object({
    en: z.string(),
    ar: z.string(),
    fa: z.string(),
  }),
  missingNutrients: z.object({
    pro: z.number().optional(),
    carb: z.number().optional(),
    fat: z.number().optional(),
  }),
});

const openai = new OpenAI({ apiKey: config.openai });

const generateAIIngredientData = async (
  name: string,
  weightInGrams: number,
  calories: number,
  existingNutrients: { pro?: number; carb?: number; fat?: number },
): Promise<z.infer<typeof aiResponseFormat>> => {
  const prompt = `Generate food ingredient data for: "${name}" (${weightInGrams}g, ${calories} cal).

EXISTING NUTRIENTS: ${JSON.stringify(existingNutrients)}

Provide the following:
1. Name translations in English, Arabic, and Farsi
2. A relevant food emoji icon
3. Single serving label (e.g., "piece", "slice", "cup") in all three languages
4. Multiple serving label (e.g., "pieces", "slices", "cups") in all three languages
5. Missing nutrient values (pro, carb, fat) if not provided, estimated based on the food type and calories

RULES:
- Provide accurate translations for the food name
- Choose appropriate serving labels (piece, slice, cup, gram, etc.)
- Estimate missing nutrients based on food type and calories
- Use relevant food emoji for icon
- Only include missingNutrients that are not already provided
- Ensure all text fields are non-empty strings`;

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a food ingredient assistant that provides accurate ingredient information in the specified format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: zodResponseFormat(aiResponseFormat, 'data'),
    });

    const { parsed } = completion.choices[0].message;
    if (!parsed) {
      throw new Error('AI response is null or invalid');
    }
    return parsed;
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw new Error('Failed to generate ingredient data with AI');
  }
};

export const createUserCustomIngredient = async (
  ingredientData: AddUserCustomIngredientDTO,
): Promise<UserIngredientType> => {
  const { name, serving } = ingredientData;
  const { weightInGrams, nutrientFacts } = serving;
  const { cal, pro, carb, fat } = nutrientFacts;

  // Extract existing nutrients
  const existingNutrients: { pro?: number; carb?: number; fat?: number } = {};
  if (pro !== undefined) existingNutrients.pro = pro;
  if (carb !== undefined) existingNutrients.carb = carb;
  if (fat !== undefined) existingNutrients.fat = fat;

  // Generate missing data with AI
  const aiData = await generateAIIngredientData(name, weightInGrams, cal, existingNutrients);

  // Assemble the complete ingredient
  const completeIngredient: UserIngredientType = {
    name: aiData.name,
    icon: aiData.icon,
    macroType: 'custom' as const,
    serving: {
      weightInGrams,
      breakpoint: 0.5,
      singleLabel: aiData.singleLabel,
      multipleLabel: aiData.multipleLabel,
      nutrientFacts: {
        cal,
        pro: pro ?? aiData.missingNutrients.pro ?? 0,
        carb: carb ?? aiData.missingNutrients.carb ?? 0,
        fat: fat ?? aiData.missingNutrients.fat ?? 0,
      },
    },
  };

  return completeIngredient;
};
