import { Types } from 'mongoose';
import httpStatus from 'http-status';

import ApiError from '@/utils/ApiError';
import { roleModelMap } from '@/models/user';
import getCurrentTimeSlot from '@/utils/get-time-slot';
import { User, Coach, BaseUser, Admin } from '@/models';

import { createUserCustomIngredient, processIngredientPrompt } from './helpers';

import type { UserBaseDoc } from '@/models/user/user-base';
import type {
  MealIngredient,
  PaginateOptions,
  QueryResult,
  TimeSlotPreferences,
  UserIngredientType,
} from 'chikrice-types';
import type {
  CreateUserDTO,
  UpdateUserDTO,
  CreateUserAddressDTO,
  UpdateUserAddressDTO,
  InitCoachCollabDTO,
  updateUserPreferencesDTO,
  AddUserCustomIngredientDTO,
  UpdateUserCustomIngredientDTO,
  ProcessIngredientPromptDTO,
} from '@/validations/user.validation';

// -------------------------------------

type UserModelInstance = InstanceType<typeof User> | InstanceType<typeof Coach> | InstanceType<typeof Admin>;

// ============================================
// USER CREATION
// ============================================
export const createUser = async (input: CreateUserDTO): Promise<UserModelInstance> => {
  if (await BaseUser.isEmailTaken(input.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const { role } = input;

  const Model = roleModelMap[role] ?? User;

  const user = await Model.create(input);

  return user;
};

// ============================================
// USER QUERYING
// ============================================
export const queryUsers = async (filter: unknown, options: PaginateOptions): Promise<QueryResult<UserBaseDoc>> => {
  const users = await BaseUser.paginate(filter, options);
  return users;
};

export const getUserById = async (id: Types.ObjectId): Promise<UserBaseDoc | null> => BaseUser.findById(id);

export const getUserByEmail = async (email: string): Promise<UserBaseDoc | null> => BaseUser.findOne({ email });

// ============================================
// USER UPDATES
// ============================================
export const updateUserById = async (userId: Types.ObjectId, updateBody: UpdateUserDTO): Promise<UserBaseDoc> => {
  const user = await BaseUser.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (updateBody.email && (await BaseUser.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  Object.assign(user, updateBody);
  await user.save();

  return user;
};

// ============================================
// USER DELETION
// ============================================
export const deleteUserById = async (userId: Types.ObjectId): Promise<UserBaseDoc> => {
  const user = await BaseUser.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

// ============================================
// USER ADDRESS CREATION
// ============================================
export const createUserAddress = async (data: CreateUserAddressDTO): Promise<void> => {
  const { userId, ...addressData } = data;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, `User with id: ${userId} not found`);
  }

  if (addressData.isPrimary) {
    user.addressBook!.forEach((_, index) => {
      user.addressBook![index].isPrimary = false;
    });
  }

  user.addressBook!.push(addressData);

  await user.save();
};

// ============================================
// USER ADDRESS UPDATES
// ============================================
export const updateUserAddress = async (addressId: Types.ObjectId, data: UpdateUserAddressDTO): Promise<void> => {
  const { userId, ...addressData } = data;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, `User with id: ${userId} not found`);
  }

  // If updating to primary, unset all other primary addresses first
  if (addressData.isPrimary) {
    await User.updateOne(
      { _id: userId },
      { $set: { 'addressBook.$[elem].isPrimary': false } },
      { arrayFilters: [{ 'elem.isPrimary': true }] },
    );
  }

  // Update the specific address using MongoDB's array update
  const result = await User.updateOne(
    { _id: userId, 'addressBook._id': addressId },
    { $set: { 'addressBook.$': addressData } },
  );

  if (result.matchedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, `Address with id: ${addressId} not found`);
  }
};

// ============================================
// USER ADDRESS DELETION
// ============================================
export const deleteUserAddressById = async (userId: Types.ObjectId, addressId: Types.ObjectId): Promise<void> => {
  const result = await User.updateOne({ _id: userId }, { $pull: { addressBook: { _id: addressId } } });

  if (result.nModified === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User or address not found');
  }
};

// ============================================
// USER MEAL PREFERENCES UPDATES
// ============================================
export const updateUserPreferences = async (userId: Types.ObjectId, data: updateUserPreferencesDTO): Promise<void> => {
  const user = await User.findById(userId);
  const { meal, isPortion, count } = data;

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const timeSlot = getCurrentTimeSlot();

  if (!timeSlot) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to determine current time slot');
  }

  if (!user.mealPreferences) {
    user.mealPreferences = {};
  }

  if (!user.mealPreferences[timeSlot]) {
    user.mealPreferences[timeSlot] = { carb: {}, pro: {}, fat: {}, free: {}, custom: {} };
  }

  if (!meal.ingredients) return;

  Object.entries(meal.ingredients).forEach(([macroType, ingredients]) => {
    if (
      macroType in user.mealPreferences[timeSlot] &&
      user.mealPreferences[timeSlot][macroType as keyof TimeSlotPreferences]
    ) {
      ingredients.forEach((ingredient: MealIngredient) => {
        const { ingredientId, portion } = ingredient;
        const macroPrefs = user.mealPreferences[timeSlot][macroType as keyof TimeSlotPreferences];

        if (macroPrefs) {
          if (!macroPrefs[ingredientId]) {
            macroPrefs[ingredientId] = {
              count: 0,
              portionSize: null,
            };
          }

          if (count !== 0) {
            macroPrefs[ingredientId].count += count;
          }

          if (isPortion) {
            macroPrefs[ingredientId].portionSize = portion.qty;
          }
        }
      });
    }
  });

  user.markModified('mealPreferences');
  await user.save();
};

// ============================================
// COACH COLLABORATION
// ============================================
export const initCoachCollab = async (userId: Types.ObjectId, body: InitCoachCollabDTO): Promise<void> => {
  const { coachId } = body;

  const coach = await Coach.findById(coachId);
  const user = await User.findById(userId);
  if (!coach) throw new ApiError(httpStatus.NOT_FOUND, 'Coach not found');
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  if (!coach.clients.includes(userId)) {
    coach.clients.push(userId);
    await coach.save();
  } else {
    throw new ApiError(httpStatus.CONFLICT, 'User already exists');
  }

  const coachData = {
    id: coach._id.toHexString(),
    age: coach.age,
    name: coach.name,
    email: coach.email,
    picture: coach.picture,
    experience: coach.experience,
    speciality: coach.speciality,
  };

  user.currentCoach = coachData;
  await user.save();
};

// ============================================
// USER CUSTOM INGREDIENTS
// ============================================
export const getUserCustomIngredients = async (userId: Types.ObjectId): Promise<UserIngredientType[]> => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  return user.customIngredients;
};

export const addUserCustomIngredient = async (
  userId: Types.ObjectId,
  ingredientData: AddUserCustomIngredientDTO,
): Promise<UserIngredientType> => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const ingredient = await createUserCustomIngredient(ingredientData);
  user.customIngredients.push(ingredient);
  await user.save();

  return user.customIngredients[user.customIngredients.length - 1];
};

export const updateUserCustomIngredient = async (userId: Types.ObjectId, updateData: UpdateUserCustomIngredientDTO) => {
  const { id: ingredientId, name, serving } = updateData;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const ingredientIndex = user.customIngredients.findIndex(
    (ingredient) => ingredient._id?.toString() === ingredientId.toString(),
  );

  if (ingredientIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Custom ingredient not found');
  }

  if (name) {
    user.customIngredients[ingredientIndex].name = name;
  }

  if (serving) {
    if (serving.weightInGrams !== undefined) {
      user.customIngredients[ingredientIndex].serving.weightInGrams = serving.weightInGrams;
    }
    if (serving.nutrientFacts) {
      user.customIngredients[ingredientIndex].serving.nutrientFacts = serving.nutrientFacts;
    }
  }

  await user.save();
  return user.customIngredients[ingredientIndex];
};

export const deleteUserCustomIngredient = async (userId: Types.ObjectId, ingredientId: Types.ObjectId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const ingredientIndex = user.customIngredients.findIndex(
    (ingredient) => ingredient._id?.toString() === ingredientId.toString(),
  );

  if (ingredientIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Custom ingredient not found');
  }

  // Remove the ingredient from the array
  user.customIngredients.splice(ingredientIndex, 1);
  await user.save();
};

// ============================================
// INGREDIENT PROMPT PROCESSING
// ============================================
export const processUserIngredientPrompt = async (
  userId: Types.ObjectId,
  data: ProcessIngredientPromptDTO,
): Promise<Array<UserIngredientType>> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const aiResponse = await processIngredientPrompt(data.prompt);

  const ingredients: Array<UserIngredientType> = aiResponse.ingredients.map((ingredient) => ({
    name: ingredient.name,
    icon: ingredient.icon,
    macroType: 'custom' as const,
    serving: {
      weightInGrams: ingredient.weightInGrams,
      breakpoint: 0.5,
      singleLabel: ingredient.singleLabel,
      multipleLabel: ingredient.multipleLabel,
      nutrientFacts: ingredient.nutrientFacts,
    },
  }));

  if (!user.customIngredients) {
    user.customIngredients = [];
  }

  user.customIngredients.push(...ingredients);

  await user.save();

  return user.customIngredients.slice(-ingredients.length);
};
