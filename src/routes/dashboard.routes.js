const express = require("express");
const router = express.Router();
const { getSummary, getCategoryTotals, getMonthlyTrends, getRecentActivity } = require("../controllers/dashboard.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/rbac.middleware");

// all roles
router.get("/summary", authenticate, authorize("viewer", "analyst", "admin"), getSummary);
router.get("/recent", authenticate, authorize("viewer", "analyst", "admin"), getRecentActivity);

// analyst and admin only
router.get("/categories", authenticate, authorize("analyst", "admin"), getCategoryTotals);
router.get("/trends", authenticate, authorize("analyst", "admin"), getMonthlyTrends);

module.exports = router;