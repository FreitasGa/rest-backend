require('dotenv').config();

module.exports = {
  app: {
    name: 'Rest',
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    tz: process.env.TZ,
  },
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  },
  helmet: {},
  auth: {
    secret: process.env.AUTH_SECRET,
    accessToken: {
      expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRES_IN,
    },
    idToken: {
      expiresIn: process.env.AUTH_ID_TOKEN_EXPIRES_IN,
    },
    refreshToken: {
      expiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    },
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
    templatesFolder: 'templates/email',
  },
  otp: {
    digits: process.env.OTP_DIGITS,
    step: process.env.OTP_STEP,
    window: process.env.OTP_WINDOW,
  },
  cache: {
    host: process.env.CACHE_HOST,
    port: process.env.CACHE_PORT,
    password: process.env.CACHE_PASSWORD,
  },
  queue: {
    host: process.env.QUEUE_HOST,
    port: process.env.QUEUE_PORT,
    password: process.env.QUEUE_PASSWORD,
    email: {
      options: {
        attempts: process.env.QUEUE_EMAIL_ATTEMPTS,
        delay: process.env.QUEUE_EMAIL_DELAY,
      },
    },
  },
  storage: {
    host: process.env.STORAGE_HOST,
    port: process.env.STORAGE_PORT,
    user: process.env.STORAGE_USER,
    password: process.env.STORAGE_PASSWORD,
  }
};
