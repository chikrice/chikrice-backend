const path = require('path');

const Joi = require('joi');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test', 'staging').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL_DEV: Joi.string().description('Mongo DB development url'),
    MONGODB_URL_STAGING: Joi.string().description('Mongo DB staging url'),
    MONGODB_URL_PROD: Joi.string().required().description('Mongo DB production url'),
    JWT_SECRET_DEV: Joi.string().description('JWT secret key for development/staging'),
    JWT_SECRET_PROD: Joi.string().required().description('JWT secret key for production'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    GOOGLE_CLIENT_ID: Joi.string().required().description('Google OAuth client ID'),
    GOOGLE_CLIENT_SECRET: Joi.string().required().description('Google OAuth client secret'),
    GOOGLE_USERINFO_URL: Joi.string().required().description('Google User info url required'),
    GOOGLE_REDIRECT_URL_DEV: Joi.string().required().description('Google Staging Dev uri required'),
    GOOGLE_REDIRECT_URL_STAGING: Joi.string().required().description('Google Staging Redirect uri required'),
    GOOGLE_REDIRECT_URL_PRODUCTION: Joi.string().required().description('Google Production Redirect uri required'),
    OPENAI_API_KEY: Joi.string().required().description('Open ai secret key'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: (() => {
      if (envVars.NODE_ENV === 'production') return envVars.MONGODB_URL_PROD;
      if (envVars.NODE_ENV === 'staging') return envVars.MONGODB_URL_STAGING;
      if (envVars.NODE_ENV === 'test') return envVars.MONGODB_URL_TEST;
      return envVars.MONGODB_URL_DEV;
    })(),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.NODE_ENV === 'production' ? envVars.JWT_SECRET_PROD : envVars.JWT_SECRET_DEV,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    userInfoUrl: envVars.GOOGLE_USERINFO_URL,
    redirectUri: (() => {
      if (envVars.NODE_ENV === 'production') return envVars.GOOGLE_REDIRECT_URL_PRODUCTION;
      if (envVars.NODE_ENV === 'staging') return envVars.GOOGLE_REDIRECT_URL_STAGING;
      return envVars.GOOGLE_REDIRECT_URL_DEV;
    })(),
  },
  openai: envVars.OPENAI_API_KEY,
};
