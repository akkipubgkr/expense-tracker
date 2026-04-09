const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

const app = express();


// ================= MONGODB CONNECTION (FIXED) =================
mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log("✅ Connected to database");
})
.catch((error) => {
  console.log("❌ Database connection failed:", error);
});


// ================= MIDDLEWARE =================
app.use(bodyParser.json());


// ================= CORS FIX =================
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PATCH, OPTIONS"
  );
  next();
});


// ================= ROUTES =================
app.use('/v1/api', expenseRoutes);
app.use('/v1/api', userRoutes);   // 🔥 FIXED (remove /USER here)


// ================= ROOT ROUTE =================
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully");
});


module.exports = app;