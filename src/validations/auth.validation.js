const Joi = require('joi');

const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    age: Joi.number().optional(),
    name: Joi.string().required(),
    gender: Joi.string().optional(),
    height: Joi.number().optional(),
    picture: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    isEmailVerified: Joi.bool().optional(),
    isWeightLifting: Joi.bool().optional(),
    startWeight: Joi.number().optional(),
    currentWeight: Joi.number().optional(),
    targetWeight: Joi.number().optional(),
    email: Joi.string().required().email(),
    activityLevel: Joi.number().optional(),
    goalAchievementSpeed: Joi.string().optional(),
    password: Joi.string().required().custom(password),
    role: Joi.string().valid('user', 'coach').required(),

    // Coach-specific fields
    speciality: Joi.when('role', {
      is: 'coach',
      then: Joi.array().items().min(1).max(2).required(),
    }),
    experience: Joi.when('role', {
      is: 'coach',
      then: Joi.number().required(),
    }),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const googleLogin = {
  body: Joi.object().keys({
    Authorization: Joi.string().required(),
    role: Joi.string().valid('user', 'coach').required(),
    userInputs: Joi.object().keys({
      age: Joi.number().optional().allow(null),
      gender: Joi.string().optional().allow(null),
      height: Joi.number().optional().allow(null),
      isWeightLifting: Joi.bool().optional().allow(null),
      startWeight: Joi.number().optional().allow(null),
      currentWeight: Joi.number().optional().allow(null),
      targetWeight: Joi.number().optional().allow(null),
      activityLevel: Joi.number().optional().allow(null),
      goalAchievementSpeed: Joi.string().optional().allow(null),

      // Coach-specific fields
      speciality: Joi.when('role', {
        is: 'coach',
        then: Joi.array().items().min(1).max(2).required(),
      }),
      experience: Joi.when('role', {
        is: 'coach',
        then: Joi.number().required(),
      }),
    }),
  }),
};

const autoLogin = {
  body: Joi.object().keys({
    accessToken: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  googleLogin,
  autoLogin,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
