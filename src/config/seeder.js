require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user.model");
const connectDB = require("./db");

const seedAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ email: "admin@finance.com" });
  if (existing) {
    console.log("Admin already exists.");
    process.exit();
  }

  await User.create({
    name: "Super Admin",
    email: "admin@finance.com",
    password: "admin123",
    role: "admin",
    status: "active",
  });

  console.log("Admin created successfully.");
  process.exit();
};

seedAdmin();