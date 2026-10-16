const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    message: "Too many requests. Please try again later",
    success: false,
  },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

module.exports = limiter;
