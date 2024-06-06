const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET_KEY;

const generateToken = (user) => {
    const payload = {
      userId: user._id,
      email: user.email,
    };
    return jwt.sign(payload, secretKey, { expiresIn: '24h' });
  };

  const verifyToken = (token) => {
    try {
      return jwt.verify(token, secretKey);
    } catch (error) {
      console.log("error :::", error); // Token is invalid
    }
  };


  module.exports = {
    generateToken,
    verifyToken,
  };
  