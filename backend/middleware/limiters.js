const rateLimit = require('express-rate-limit');

// OTP verify — 10 attempts / 15 min per IP
// Brute force se 6-digit OTP crack karna impossible ho jata hai
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many OTP attempts. Please try again after 15 minutes.'
    });
  }
});

module.exports = { otpLimiter };
