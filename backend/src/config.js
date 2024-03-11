// backend/src/config/config.js

const crypto = require('crypto');

const generateJWTSecretKey = () => {
  const keyLength = 64; // 512 bits
  return crypto.randomBytes(keyLength).toString('hex');
};

module.exports = {
  mongoURI: 'mongodb://localhost:27017/your_database_name', // Update with your MongoDB connection string and database name
  jwtSecret: process.env.JWT_SECRET_KEY || generateJWTSecretKey(), // Use environment variable or generate a random key
};
