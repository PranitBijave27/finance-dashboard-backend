const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    //email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(409, "Email already registered."));
    }

    const user = await User.create({ name, email, password, role:"viewer" });

    // generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ApiError(401, "Invalid email or password."));
    }

    if (user.status === "inactive") {
      return next(new ApiError(403, "Your account has been deactivated."));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ApiError(401, "Invalid email or password."));
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };