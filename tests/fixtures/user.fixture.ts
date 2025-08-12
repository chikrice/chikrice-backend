const faker = require('faker');
const mongoose = require('mongoose');

const { User, Coach, Admin } = require('../../src/models');

import type { Types } from 'mongoose';

//-------------------------

interface UserType {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'coach';
  isEmailVerified: boolean;
}

export const defaultNullData = {
  age: null,
  gender: null,
  height: null,
  picture: null,
  roadmapId: null,
  phoneNumber: null,
  startWeight: null,
  targetWeight: null,
  currentCoach: null,
  currentWeight: null,
  activityLevel: null,
  isWeightLifting: null,
  goalAchievementSpeed: null,
  //
  savedPlans: [],
  addressBook: [],
  allergicFoods: [],
};

export const userOne: UserType = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password: 'password1',
  role: 'user',
  isEmailVerified: false,
};

export const userTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password: 'password2',
  role: 'user',
  isEmailVerified: false,
};

export const userThree = {
  _id: mongoose.Types.ObjectId(),
  name: 'khaled',
  email: 'khaled@gmail.com',
  password: 'password3',
  role: 'user',
  isEmailVerified: false,
  age: 26,
  startWeight: 73,
  targetWeight: 84,
  gender: 'male',
  height: 181,
  picture: '',
  phoneNumber: '+971502597949',
  activityLevel: 5,
  isWeightLifting: true,
  goalAchievementSpeed: 'recommended',
  // null data
  roadmapId: null,
  savedPlans: [],
  addressBook: [],
  currentCoach: null,
  currentWeight: null,
  allergicFoods: [],
};

export const admin = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password: 'password4',
  role: 'admin',
  isEmailVerified: false,
};

export const insertUsers = async (users: any) => {
  await Promise.all(
    users.map(async (user: any) => {
      let Model = User;
      if (user.role === 'admin') Model = Admin;
      if (user.role === 'coach') Model = Coach;
      await Model.create({ ...user, password: user.password });
    }),
  );
};
