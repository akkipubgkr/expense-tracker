const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

const app = express();

// ✅ MongoDB Connection
mongoose.connect(
  'mongodb+srv://akkipubgkr_db_user:' + process.env.MONGO_ATLAS_PW + '@cluster0.rxabfjf.mongodb.net/expenseTracker?retryWrites=true&w=majority'
)
.then(() => {
  console.log("✅ Connected to database");
})
.catch((error) => {
  console.log("❌ Not able to connect to database:", error);
});

// ✅ Middleware
app.use(bodyParser.json());

// ✅ CORS Fix
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

// ✅ Routes
app.use('/v1/api', expenseRoutes);
app.use('/v1/api/user', userRoutes);

// ✅ Export App
module.exports = app;