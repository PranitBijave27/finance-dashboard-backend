const Record = require("../models/record.model");
const ApiError = require("../utils/ApiError");

// GET: /api/records
const getAllRecords = async (req, res, next) => {
  try {
    const filter = {};

    // filters
    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
    }

    const records = await Record.find(filter)
      .populate("createdBy", "name email role")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (err) {
    next(err);
  }
};

// GET: /api/records/:id
const getRecordById = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id).populate(
      "createdBy",
      "name email role",
    );
    if (!record) {
      return next(new ApiError(404, "Record not found."));
    }

    res.status(200).json({
      success: true,
      record,
    });
  } catch (err) {
    next(err);
  }
};

// POST: /api/records
const createRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const record = await Record.create({
      amount,
      type,
      category,
      date,
      notes,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      record,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH: /api/records/:id
const updateRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      return next(new ApiError(404, "Record not found."));
    }

    const { amount, type, category, date, notes } = req.body;

    if (amount !== undefined) record.amount = amount;
    if (type !== undefined) record.type = type;
    if (category !== undefined) record.category = category;
    if (date !== undefined) record.date = date;
    if (notes !== undefined) record.notes = notes;

    await record.save();

    res.status(200).json({
      success: true,
      message: "Record updated successfully.",
      record,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE: /api/records/:id
const deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      return next(new ApiError(404, "Record not found."));
    }

    // soft delete
    record.isDeleted = true;
    await record.save();

    res.status(200).json({
      success: true,
      message: "Record deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
};
