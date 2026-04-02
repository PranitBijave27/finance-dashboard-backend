const express = require("express");
const router = express.Router();
const { getAllRecords, getRecordById, createRecord, updateRecord, deleteRecord } = require("../controllers/record.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/rbac.middleware");
const validate = require("../middleware/validate.middleware");
const { createRecordSchema, updateRecordSchema } = require("../validators/record.validator");

// all roles can view
router.get("/",authenticate, authorize("viewer", "analyst", "admin"), getAllRecords);
router.get("/:id", authenticate, authorize("viewer", "analyst", "admin"), getRecordById);

// admin only
router.post("/", authenticate, authorize("admin"), validate(createRecordSchema), createRecord);
router.patch("/:id", authenticate, authorize("admin"), validate(updateRecordSchema), updateRecord);
router.delete("/:id", authenticate, authorize("admin"), deleteRecord);

module.exports = router;