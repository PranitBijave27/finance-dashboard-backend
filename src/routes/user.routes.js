const express = require("express");
const router = express.Router();
const { getAllUsers, updateRole, updateStatus } = require("../controllers/user.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/rbac.middleware");
const validate = require("../middleware/validate.middleware");
const { updateRoleSchema, updateStatusSchema } = require("../validators/user.validator");

// all routes are admin only
router.get("/", authenticate, authorize("admin"), getAllUsers);
router.patch("/:id/role", authenticate, authorize("admin"), validate(updateRoleSchema), updateRole);
router.patch("/:id/status", authenticate, authorize("admin"), validate(updateStatusSchema), updateStatus);

module.exports = router;