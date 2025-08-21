import { Types } from 'mongoose';
import httpStatus from 'http-status';

import ApiError from '@/utils/ApiError';
import { roleModelMap } from '@/models/user';
import getCurrentTimeSlot from '@/utils/get-time-slot';
import { User, Coach, BaseUser, Admin } from '@/models';

import type { UserBaseDoc } from '@/models/user/user-base';
import type { Meal, MealIngredient, PaginateOptions, QueryResult, TimeSlotPreferences } from 'chikrice-types';
import type {
  CreateUserDTO,
  UpdateUserDTO,
  CreateUserAddressDTO,
  UpdateUserAddressDTO,
  InitCoachCollabDTO,
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
export const updateUserMealPreferences = async (userId: Types.ObjectId, meal: Meal): Promise<void> => {
  const user = await User.findById(userId);
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
    user.mealPreferences[timeSlot] = { carb: {}, pro: {}, fat: {}, free: {} };
  }

  // Update preferences based on final meal state
  Object.entries(meal.ingredients).forEach(([macroType, ingredients]) => {
    if (
      macroType in user.mealPreferences[timeSlot] &&
      user.mealPreferences[timeSlot][macroType as keyof TimeSlotPreferences]
    ) {
      ingredients.forEach((ingredient: MealIngredient) => {
        const { ingredientId, portion } = ingredient;
        const macroPrefs = user.mealPreferences[timeSlot][macroType as keyof TimeSlotPreferences];

        if (macroPrefs) {
          // Initialize ingredient preference if it doesn't exist
          if (!macroPrefs[ingredientId]) {
            macroPrefs[ingredientId] = {
              count: 0,
              portionSize: null,
            };
          }

          // Update count and portion size based on final meal state
          macroPrefs[ingredientId].count += 1;
          macroPrefs[ingredientId].portionSize = portion.qty;
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
