const moment = require('moment');
const httpStatus = require('http-status');

const config = require('../config/config');
const ApiError = require('../utils/ApiError');

const { userService, tokenService } = require('.');

/**
 * Generate a 6-digit verification code
 * @returns {string}
 */
const generateVerificationCode = () =>
  // Generate a random 6-digit number (100000 to 999999)
  Math.floor(100000 + Math.random() * 900000).toString();
/**
 * Generate and store verification code for user
 * @param {string} userId
 * @returns {Promise<string>}
 */
const generateAndStoreVerificationCode = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.isEmailVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already verified');
  }
  const code = generateVerificationCode();
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes').toDate();

  // Update user with verification code and expiration
  await userService.updateUserById(user._id, {
    emailVerificationCode: code,
    emailVerificationCodeExpires: expires,
  });

  return code;
};

/**
 * Verify email verification code
 * @param {Object} params - Verification parameters
 * @param {string} params.email - User's email
 * @param {string} params.code - 6-digit verification code
 * @param {boolean} params.isResetPassword - Whether this is for password reset
 * @returns {Promise<Object>} - User object or token object
 */
const verifyEmailCode = async ({ email, code, isResetPassword = false }) => {
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!user.emailVerificationCode || !user.emailVerificationCodeExpires) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No verification code found. Please request a new one.');
  }

  // Check if code has expired
  if (moment().isAfter(user.emailVerificationCodeExpires)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Verification code has expired. Please request a new one.');
  }

  // Check if code matches
  if (user.emailVerificationCode !== code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid verification code');
  }

  // Code is valid - clear the verification code
  await userService.updateUserById(user.id, {
    emailVerificationCode: null,
    emailVerificationCodeExpires: null,
  });

  // Handle different scenarios based on isResetPassword flag
  if (isResetPassword) {
    // For password reset: verify email if not already verified and return reset token
    if (!user.isEmailVerified) {
      await userService.updateUserById(user.id, {
        isEmailVerified: true,
      });
    }

    // Generate password reset token
    const resetPasswordToken = await tokenService.generateResetPasswordToken(email);

    return {
      success: true,
      message: 'Email verified and password reset token generated',
      resetPasswordToken,
      user: {
        id: user.id,
        email: user.email,
        isEmailVerified: true,
      },
    };
  }
  // For regular email verification: verify the email
  if (user.isEmailVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already verified');
  }

  await userService.updateUserById(user.id, {
    isEmailVerified: true,
  });

  return {
    success: true,
    message: 'Email verified successfully',
    user: {
      id: user.id,
      email: user.email,
      isEmailVerified: true,
    },
  };
};

/**
 * Check if verification code exists and is valid for user
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
const hasValidVerificationCode = async (userId) => {
  const user = await userService.getUserById(userId);

  if (!user || !user.emailVerificationCode || !user.emailVerificationCodeExpires) {
    return false;
  }

  return moment().isBefore(user.emailVerificationCodeExpires);
};

/**
 * Clear verification code for user
 * @param {string} userId
 * @returns {Promise}
 */
const clearVerificationCode = async (userId) => {
  await userService.updateUserById(userId, {
    emailVerificationCode: null,
    emailVerificationCodeExpires: null,
  });
};

module.exports = {
  generateVerificationCode,
  generateAndStoreVerificationCode,
  verifyEmailCode,
  hasValidVerificationCode,
  clearVerificationCode,
};
