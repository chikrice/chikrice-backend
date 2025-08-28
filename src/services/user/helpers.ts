import 'openai/shims/node';
import { z } from 'zod';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';

import config from '@/config/config';

import type { UserIngredientType } from 'chikrice-types';
import type { AddUserCustomIngredientDTO } from '@/validations/user.validation';

const openai = new OpenAI({ apiKey: config.openai });

const ingredientPromptFormat = z.object({
  ingredients: z.array(
    z.object({
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
      weightInGrams: z.number().positive(),
      nutrientFacts: z.object({
        cal: z.number().nonnegative(),
        pro: z.number().nonnegative(),
        carb: z.number().nonnegative(),
        fat: z.number().nonnegative(),
      }),
    }),
  ),
});

export const processIngredientPrompt = async (prompt: string): Promise<z.infer<typeof ingredientPromptFormat>> => {
  const systemPrompt = `You are a food ingredient assistant that processes natural language food descriptions and converts them into structured ingredient data.

Your task is to:
1. Parse the input prompt which contains food items with quantities (e.g., "1 mac chicken, 1 Cola,  2.5 خبز رقاق")
2. Extract quantity, unit (if any), and food name for each item
3. Generate complete ingredient data including:
   - Name translations in English, Arabic, and Farsi
   - Appropriate food emoji icon
   - Single and multiple serving labels in all three languages
   - Accurate weightInGrams based on the food item and quantity mentioned
   - Complete nutrientFacts (calories, protein, carbs, fat) estimated based on the food type and portion size

RULES:
- Parse quantities correctly (numbers, decimals, fractions)
- Identify units when present (piece, cup, gram, etc.)
- Translate food names accurately between languages
- Choose appropriate serving labels (piece, slice, cup, gram, etc.)
- Calculate accurate weightInGrams based on the food item and quantity
- Estimate complete nutrientFacts based on food type and portion size
- Use relevant food emoji for each ingredient
- Handle mixed language inputs (Arabic, English, Farsi)
- Ensure all text fields are non-empty strings
- Return exactly the number of ingredients found in the prompt

Example input: "1 mac chicken, 1 Cola,  2.5 خبز رقاق"
Example output: Array of 3 ingredients with complete data including accurate weightInGrams and nutrientFacts`;

  const userPrompt = `Process the following food prompt and extract all ingredients:

${prompt}

Please provide the structured data for each ingredient found in the prompt, including accurate weightInGrams and complete nutrientFacts based on the food type and quantity mentioned.`;

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      response_format: zodResponseFormat(ingredientPromptFormat, 'data'),
    });

    const { parsed } = completion.choices[0].message;
    if (!parsed) {
      throw new Error('AI response is null or invalid');
    }
    return parsed;
  } catch (error) {
    throw new Error(`Failed to process ingredient prompt with AI: ${error}`);
  }
};

// ============================================
// CREATE CUSTOM INGREIDENT
// ============================================
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

const generateAIIngredientData = async (
  name: { en?: string; ar?: string; fa?: string },
  weightInGrams: number,
  calories: number,
  existingNutrients: { pro?: number; carb?: number; fat?: number },
): Promise<z.infer<typeof aiResponseFormat>> => {
  const providedLanguages = Object.entries(name)
    .filter(([, value]) => value && value.trim() !== '')
    .map(([lang, value]) => `${lang}: "${value}"`)
    .join(', ');

  const prompt = `Generate food ingredient data for a food item with the following name: ${providedLanguages} (${weightInGrams}g, ${calories} cal).

EXISTING NUTRIENTS: ${JSON.stringify(existingNutrients)}

Provide the following:
1. Complete name translations in English, Arabic, and Farsi (translate from the provided language to fill missing ones)
2. A relevant food emoji icon
3. Single serving label (e.g., "piece", "slice", "cup") in all three languages
4. Multiple serving label (e.g., "pieces", "slices", "cups") in all three languages
5. Missing nutrient values (pro, carb, fat) if not provided, estimated based on the food type and calories

RULES:
- Translate the food name accurately from the provided language to the missing languages
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
    throw new Error(`Failed to generate ingredient data with AI: ${error}`);
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
