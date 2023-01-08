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
};
