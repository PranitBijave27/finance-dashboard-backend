const rateLimit = require("express-rate-limit");

//limiter for all routes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per 15 minutes
  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 login/register attempts per 15 minutes
  message: {
    success: false,
    message: "Too many auth attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { globalLimiter, authLimiter };