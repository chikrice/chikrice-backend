require('openai/shims/node');

const { z } = require('zod');
const OpenAI = require('openai');
const { zodResponseFormat } = require('openai/helpers/zod');

const config = require('@/config/config');

const ingredientFormat = z.object({
  name: z.object({
    en: z.string(),
    ar: z.string(),
    fa: z.string(),
  }),
  icon: z.string(),
  macroType: z.enum(['carb', 'pro', 'fat']),
  serving: z.object({
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
    breakpoint: z.number(),
    qty: z.number(),
    weightInGrams: z.number(),
    nutrientFacts: z.object({
      cal: z.number(),
      carb: z.number(),
      pro: z.number(),
      fat: z.number(),
    }),
  }),
  portion: z.object({
    label: z.object({
      en: z.string(),
      ar: z.string(),
    }),
    qty: z.number(),
    weightInGrams: z.number(),
  }),
  macros: z.object({
    cal: z.number(),
    carb: z.number(),
    pro: z.number(),
    fat: z.number(),
  }),
});

const outputFormat = z.object({
  ingredients: z.array(ingredientFormat),
});

const openai = new OpenAI({ apiKey: config.openai });

const prompt = `You are a smart assistant for a fitness app. Your job is to extract ingredient information from the user's input and provide detailed nutritional data. Please follow these guidelines:

1. Identify each ingredient mentioned in the user's input.
2. For each ingredient, provide the following details:
   - **Name**: Include the name in both English, Arabic, and Farsi.
   - **Icon**: Use an appropriate emoji as the icon.
   - **Macro Type**: Specify whether the ingredient is a carbohydrate, protein, or fat.
   - **Serving Details**:
     - **Weight**: Specify the weight in grams for one serving.
     - **Nutrient Facts**: Provide the nutritional breakdown, including cal, carb, pro, and fat for the specified serving size.
   - **Portion**: Indicate the user-specified quantity and its label.
     - **Label**: Do not include count in label value, it should be only the item label with no prefix number.

3. If the input does not represent a valid meal or ingredient, return 'null' without any additional comments.

Make sure to present the information clearly and concisely. Use emojis for icons, and remember not to include counts in the serving labels. Provide accurate nutrient facts based on standard measurements.`;

async function getMealMacroWithAi(userPrompt) {
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      response_format: zodResponseFormat(outputFormat, 'data'),
    });

    const data = completion.choices[0].message.parsed;

    return data;
  } catch (error) {
    console.error('Error generating completion:', error);
    return null;
  }
}

module.exports = getMealMacroWithAi;
