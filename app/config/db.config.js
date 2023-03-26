module.exports = {
  url: process.env.vidly_db
    ? process.env.vidly_db
    : "mongodb://127.0.0.1:27017/vidly",
  jwtPrivateKey: process.env.jwtPrivateKey
    ? process.env.jwtPrivateKey
    : "unsecureKey",
  requiresAuth: true,
};
