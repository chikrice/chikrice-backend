// Mock the googleAuth module before any imports
const mockGetToken = jest.fn();
const mockOAuth2Client = {
  getToken: mockGetToken,
};

jest.mock('../../../src/config/googleAuth', () => ({
  oAuth2Client: mockOAuth2Client,
}));

const axios = require('axios');
const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../../../src/app');
const setupTestDB = require('../../utils/setupTestDB');
const { authService, userService } = require('../../../src/services');
const { defaultNullData, insertUsers, userThree } = require('../../fixtures/user.fixture');

setupTestDB();
jest.mock('axios');

describe('POST v1/auth/google-login', () => {
  const validAuthorizationCode = 'validAuthCode';
  const validAccessToken = 'validAccessToken';
  const validRefreshToken = 'validRefreshToken';

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock the getToken method to return valid tokens
    mockGetToken.mockResolvedValue({
      tokens: {
        access_token: validAccessToken,
        refresh_token: validRefreshToken,
        expires_in: 3600,
      },
    });
  });

  // CASE 200 -> returning existing user
  test('should return 200 and user data if user already exists and token is valid', async () => {
    await insertUsers([userThree]);

    axios.get = jest.fn().mockResolvedValue({
      data: userThree,
    });

    const dbUser = await userService.getUserByEmail(userThree.email);
    expect(dbUser).toBeDefined();

    const result = await authService.loginWithGoogle(validAuthorizationCode);

    expect(mockGetToken).toHaveBeenCalledWith(validAuthorizationCode);

    expect(axios.get).toHaveBeenCalledWith(expect.any(String), {
      headers: { Authorization: `Bearer ${validAccessToken}` },
    });

    expect(result.isFirstLogin).toBe(false);

    const userObject = result.user.toJSON();

    expect(userObject.id).toBe(userThree._id.toString());
  });

  // CASE 201
  test('should return 201 and and create new user if user doesn not exists and token is valid', async () => {
    const newUser = {
      email: 'user@example.com',
      name: 'John Doe',
      picture: 'http://example.com/avatar.jpg',
      verified_email: true,
    };

    // Mock the axios.get to simulate a successful response from Google's user info endpoint
    axios.get = jest.fn().mockResolvedValue({
      data: newUser,
    });

    const dbUser = await userService.getUserByEmail(newUser.email);

    expect(dbUser).toBe(null);

    // Simulate a valid login
    const result = await authService.loginWithGoogle(validAuthorizationCode);

    // Ensure the oAuth client was called with the correct AuthorizationCode
    expect(mockGetToken).toHaveBeenCalledWith(validAuthorizationCode);

    // Ensure that axios.get was called with the correct Bearer token
    expect(axios.get).toHaveBeenCalledWith(expect.any(String), {
      headers: { Authorization: `Bearer ${validAccessToken}` },
    });

    const userObject = result.user.toJSON();

    expect(result.isFirstLogin).toBe(true);
    expect(userObject).toEqual({
      ...defaultNullData,
      role: 'user',
      email: 'user@example.com',
      name: 'John Doe',
      picture: 'http://example.com/avatar.jpg',
      isEmailVerified: true,
      id: userObject.id,
      registrationMethod: 'google',
    });
  });

  // CASE 400 Authroization missing
  test('should return 400 if Authorization is not included', async () => {
    await request(app).post('/v1/auth/google-login').send().expect(httpStatus.BAD_REQUEST);
  });

  // CASE 401
  test('should return 401 if the Authorization token is invalid', async () => {
    const invalidAuthorizationToken = 'invalidToken';

    mockGetToken.mockRejectedValue(new Error('invalid_grant'));

    await expect(authService.loginWithGoogle(invalidAuthorizationToken)).rejects.toThrow('invalid_grant');

    expect(mockGetToken).toHaveBeenCalledWith(invalidAuthorizationToken);
  });
});
