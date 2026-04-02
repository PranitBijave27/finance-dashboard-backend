const Record = require("../models/record.model");

// GET /api/dashboard/summary
const getSummary = async (req, res, next) => {
  try {
    const result = await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    result.forEach((item) => {
      if (item._id === "income") {
        totalIncome = item.total;
        incomeCount = item.count;
      } else if (item._id === "expense") {
        totalExpenses = item.total;
        expenseCount = item.count;
      }
    });

    res.status(200).json({
      success: true,
      summary: {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        totalRecords: incomeCount + expenseCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/dashboard/categories
const getCategoryTotals = async (req, res, next) => {
  try {
    const result = await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const categories = result.map((item) => ({
      category: item._id.category,
      type: item._id.type,
      total: item.total,
      count: item.count,
    }));

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/dashboard/trends
const getMonthlyTrends = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();

    const result = await Record.aggregate([
      {
        $match: {
          isDeleted: false,
          date: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$date" }, type: "$type" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // build a clean 12 month structure
    const months = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December",
    ];

    const trends = months.map((month, index) => {
      const monthNumber = index + 1;

      const incomeEntry = result.find(
        (r) => r._id.month === monthNumber && r._id.type === "income"
      );
      const expenseEntry = result.find(
        (r) => r._id.month === monthNumber && r._id.type === "expense"
      );

      return {
        month,
        income: incomeEntry ? incomeEntry.total : 0,
        expenses: expenseEntry ? expenseEntry.total : 0,
      };
    });

    res.status(200).json({
      success: true,
      year: currentYear,
      trends,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/dashboard/recent
const getRecentActivity = async (req, res, next) => {
  try {
    const records = await Record.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      records,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary, getCategoryTotals, getMonthlyTrends, getRecentActivity };