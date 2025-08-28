import { z } from 'zod';

import { passwordSchema, zObjectId } from './custom.validation';

// -------------------------------------

export const createUser = {
  body: z.object({
    email: z.string().email(),
    password: passwordSchema,
    picture: z.string().optional(),
    name: z.string(),
    role: z.enum(['user', 'admin', 'coach']).default('user'),
    registrationMethod: z.enum(['google', 'manual', 'admin']).default('manual'),
    //
    age: z.number().int().min(0).max(120).optional(),
    height: z.number().int().min(0).optional(),
    gender: z.enum(['male', 'female']).optional(),
    startWeight: z.number().int().min(0).optional(),
    targetWeight: z.number().int().min(0).optional(),
    activityLevel: z.number().int().min(1).max(5).optional(),
    isWeightLifting: z.boolean().default(false),
    goalAchievementSpeed: z.string().optional(),
  }),
};

export type CreateUserDTO = z.infer<typeof createUser.body>;

export const queryUsers = {
  query: z
    .object({
      name: z.string(),
      role: z.string(),
      sortBy: z.string(),
      limit: z.string(),
      page: z.string(),
    })
    .partial(),
};

export const getUser = {
  params: z.object({
    userId: zObjectId,
  }),
};

export const updateUser = {
  params: z.object({
    userId: zObjectId,
  }),
  body: z
    .object({
      age: z.number(),
      name: z.string(),
      gender: z.string(),
      height: z.number(),
      picture: z.string(),
      phoneNumber: z.string(),
      isEmailVerified: z.boolean(),
      isWeightLifting: z.boolean(),
      startWeight: z.number(),
      currentWeight: z.number(),
      targetWeight: z.number(),
      email: z.string().email(),
      activityLevel: z.number(),
      goalAchievementSpeed: z.string(),
      allergicFoods: z.array(z.string()),
      addressBook: z.array(z.unknown()),
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
};

export type UpdateUserDTO = z.infer<typeof updateUser.body>;

export const deleteUser = {
  params: z.object({
    userId: zObjectId,
  }),
};

export const createUserAddress = {
  body: z.object({
    notes: z.string().optional(),
    name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    isPrimary: z.boolean(),
    addressLink: z.string(),
    fullAddress: z.string(),
    phoneNumber: z.string(),
    userId: zObjectId,
    addressType: z.enum(['home', 'office']),
  }),
};

export type CreateUserAddressDTO = z.infer<typeof createUserAddress.body>;

export const updateUserAddress = {
  params: z.object({
    addressId: zObjectId,
  }),
  body: z.object({
    notes: z.string().optional(),
    name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    isPrimary: z.boolean(),
    addressLink: z.string(),
    fullAddress: z.string(),
    phoneNumber: z.string(),
    userId: zObjectId,
    addressType: z.enum(['home', 'office']),
  }),
};

export type UpdateUserAddressDTO = z.infer<typeof updateUserAddress.body>;

export const updateUserPreferences = {
  params: z.object({
    userId: zObjectId,
  }),
  body: z.object({
    meal: z
      .object({
        ingredients: z
          .object({
            carb: z.array(z.any()),
            pro: z.array(z.any()),
            fat: z.array(z.any()),
            free: z.array(z.any()),
            custom: z.array(z.any()),
          })
          .optional(),
      })
      .passthrough(),
    count: z.number().int().min(-1).max(1),
    isPortion: z.boolean(),
  }),
};

export type updateUserPreferencesDTO = z.infer<typeof updateUserPreferences.body>;

export const deleteUserAddress = {
  params: z.object({
    addressId: zObjectId,
  }),
  query: z.object({
    userId: zObjectId,
  }),
};

export const initCoachCollab = {
  params: z.object({
    userId: zObjectId,
  }),
  body: z.object({
    coachId: zObjectId,
  }),
};

export type InitCoachCollabDTO = z.infer<typeof initCoachCollab.body>;

// User Custom Ingredients Validations
export const getUserCustomIngredients = {
  params: z.object({
    userId: zObjectId,
  }),
};

export const addUserCustomIngredient = {
  params: z.object({
    userId: zObjectId,
  }),
  body: z.object({
    name: z
      .object({
        en: z.string().optional(),
        ar: z.string().optional(),
        fa: z.string().optional(),
      })
      .refine((name) => name.en || name.ar || name.fa, {
        message: 'At least one language name is required',
      }),
    serving: z.object({
      weightInGrams: z.number().positive(),
      nutrientFacts: z.object({
        cal: z.number().nonnegative(),
        pro: z.number().nonnegative().optional(),
        carb: z.number().nonnegative().optional(),
        fat: z.number().nonnegative().optional(),
      }),
    }),
  }),
};

export type AddUserCustomIngredientDTO = z.infer<typeof addUserCustomIngredient.body>;

export const updateUserCustomIngredient = {
  params: z.object({
    userId: zObjectId,
  }),
  body: z.object({
    id: zObjectId,
    name: z.object({
      en: z.string(),
      ar: z.string(),
      fa: z.string(),
    }),
    serving: z.object({
      weightInGrams: z.number().positive(),
      nutrientFacts: z.object({
        cal: z.number().nonnegative(),
        pro: z.number().nonnegative(),
        carb: z.number().nonnegative(),
        fat: z.number().nonnegative(),
      }),
    }),
  }),
};

export type UpdateUserCustomIngredientDTO = z.infer<typeof updateUserCustomIngredient.body>;

export const deleteUserCustomIngredient = {
  params: z.object({
    userId: zObjectId,
  }),
  query: z.object({
    ingredientId: zObjectId,
  }),
};

export type DeleteUserCustomIngredientDTO = z.infer<typeof deleteUserCustomIngredient.query>;

export const processIngredientPrompt = {
  params: z.object({
    userId: zObjectId,
  }),
  body: z.object({
    prompt: z.string().min(1, 'Prompt cannot be empty'),
  }),
};

export type ProcessIngredientPromptDTO = z.infer<typeof processIngredientPrompt.body>;
