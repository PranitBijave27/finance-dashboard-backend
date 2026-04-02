const express = require("express");
const authRoutes = require("./src/routes/auth.routes");
const userRoutes =require("./src/routes/user.routes");
const recordRoutes = require("./src/routes/record.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const { globalLimiter, authLimiter } = require("./src/middleware/rateLimiter.middleware");


const app = express();

app.use(express.json());
app.use(globalLimiter);

// registered routes
app.use("/api/auth",authLimiter, authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);



app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;