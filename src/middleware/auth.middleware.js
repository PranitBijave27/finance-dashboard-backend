const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

const authenticate = async (req, res, next) => {
  try {
    //authorization header exists or not
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError(401, "Access denied. No token provided."));
    }

    //token extraction
    const token = authHeader.split(" ")[1];

    //token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // fetch user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ApiError(401, "User no longer exists."));
    }

    // check if user is active
    if (user.status === "inactive") {
      return next(new ApiError(403, "Your account has been deactivated."));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired token."));
  }
};

module.exports = authenticate;