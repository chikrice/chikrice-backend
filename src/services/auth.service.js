const axios = require('axios');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const { Token } = require('../models');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { oAuth2Client } = require('../config/googleAuth');

const tokenService = require('./token.service');
const coachService = require('./coach.service');
const userService = require('./user/user.service');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Email not found');
  }
  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Authorize with Google and fetch existing user if they exist
 * @param {string} Authorization
 * @returns {Promise<{userInfo: object, existingUser: User | null}>}
 */
const authorizeAndFetchGoogleUser = async (Authorization) => {
  try {
    // Fetch tokens from Google
    const { tokens } = await oAuth2Client.getToken(Authorization);

    // Fetch user info from Google
    const { data: userInfo } = await axios.get(config.google.userInfoUrl, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    // Extract user details from Google response
    const { email, name, picture, verified_email: isEmailVerified } = userInfo;

    // Check if the user already exists
    const existingUser = await userService.getUserByEmail(email);

    return { userInfo: { email, name, picture, isEmailVerified }, existingUser };
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

/**
 * Login with Google for Users or Coaches
 * @param {string} Authorization
 * @param {object} userInputs
 * @param {string} role
 * @returns {Promise<{user: User, isFirstLogin: boolean}>}
 */
const loginWithGoogle = async (Authorization, userInputs, role) => {
  const { userInfo, existingUser } = await authorizeAndFetchGoogleUser(Authorization);

  const isCoach = role === 'coach';

  if (existingUser) {
    return { user: existingUser, isFirstLogin: false };
  }
  const creationService = isCoach ? coachService.createCoach : userService.createUser;

  const newUser = await creationService({
    ...userInfo,
    ...userInputs,
    registrationMethod: 'google',
  });

  return { user: newUser, isFirstLogin: true };
};

/**
 *  Auto login using accessToken
 * @param {string} accessToken
 * @returns {Promise<User>}
 */
const autoLoginWithAcessToken = async (accessToken) => {
  try {
    const payload = jwt.verify(accessToken, config.jwt.secret);
    const userId = payload.sub;

    return await userService.getUserById(userId);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Invalid token ${error}`);
  }
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });

  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }

  return refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Please authenticate${error}`);
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Password reset failed ${error}`);
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Email verification failed: ${error}`);
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  autoLoginWithAcessToken,
  loginWithGoogle,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
