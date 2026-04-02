const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

// GET /api/users
const getAllUsers = async (req, res, next) => {
  try {
    const filter = {};

    //status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const users = await User.find(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/:id/role
const updateRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ApiError(404, "User not found."));
    }
    console.log(user.role, "::::",req.body.role) //bug checker

    user.role = req.body.role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Role updated successfully.",
      user,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/:id/status
const updateStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ApiError(404, "User not found."));
    }

    // prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return next(new ApiError(400, "You cannot change your own status."));
    }

    user.status = req.body.status;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully.",
      user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, updateRole, updateStatus };