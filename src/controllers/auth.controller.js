const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, verificationCodeService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const googleLogin = catchAsync(async (req, res) => {
  const { Authorization, userInputs, role } = req.body;
  const { user, isFirstLogin } = await authService.loginWithGoogle(Authorization, userInputs, role);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens, isFirstLogin });
});

const autoLogin = catchAsync(async (req, res) => {
  const { accessToken } = req.body;
  const user = await authService.autoLoginWithAcessToken(accessToken);
  res.send({ user });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send({ success: true });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmailCode = catchAsync(async (req, res) => {
  const { email } = req.body;
  const code = await verificationCodeService.generateAndStoreVerificationCode(email);
  await emailService.sendVerificationEmailCode(email, code);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmailCode = catchAsync(async (req, res) => {
  const { email, code, isResetPassword } = req.body;
  const result = await verificationCodeService.verifyEmailCode({ email, code, isResetPassword });

  if (isResetPassword && result.resetPasswordToken) {
    // Return the reset password token for password reset flow
    res.send({
      success: true,
      message: result.message,
      resetPasswordToken: result.resetPasswordToken,
      user: result.user,
    });
  } else {
    // Regular email verification - return success
    res.send({
      success: true,
      message: result.message,
      user: result.user,
    });
  }
});

const resendVerificationCode = catchAsync(async (req, res) => {
  const { email, isResetPassword = false } = req.body;
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!isResetPassword && user.isEmailVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already verified');
  }

  const code = await verificationCodeService.generateAndStoreVerificationCode(email);
  await emailService.sendVerificationEmailCode(email, code);

  res.send({
    success: true,
    message: 'Verification code sent successfully',
    isResetPassword,
  });
});

module.exports = {
  login,
  logout,
  register,
  autoLogin,
  verifyEmail,
  googleLogin,
  refreshTokens,
  resetPassword,
  forgotPassword,
  sendVerificationEmail,
  sendVerificationEmailCode,
  verifyEmailCode,
  resendVerificationCode,
};
