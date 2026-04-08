const express = require("express");
const UserModel = require("../models/userModel");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    const { name, username, gmail, password, userFirstSignUp, category } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ gmail });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        status: false
      });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const user = new UserModel({
      name,
      username,
      gmail,
      password: hash,
      userFirstSignUp,
      category: category || []
    });

    const result = await user.save();

    // Generate token
    const token = jwt.sign(
      { gmail: result.gmail, userId: result._id },
      process.env.JWT_KEY || "default_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Account Created Successfully",
      status: true,
      data: {
        userId: result._id,
        username: result.username,
        name: result.name,
        token: token,
        expiredToken: 3600
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Signup failed",
      error: err.message
    });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { gmail, password } = req.body;

    const user = await UserModel.findOne({ gmail });

    if (!user) {
      return res.status(401).json({
        message: "Invalid Email",
        status: false
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid Password",
        status: false
      });
    }

    const token = jwt.sign(
      { gmail: user.gmail, userId: user._id },
      process.env.JWT_KEY || "default_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login Successful",
      status: true,
      data: {
        token: token,
        userId: user._id,
        expiredToken: 3600
      }
    });

  } catch (err) {
    res.status(500).json({
      message: "Login failed",
      error: err.message
    });
  }
});


// ================= TEST ROUTE (for browser) =================
router.get("/", (req, res) => {
  res.send("User API working ✅");
});

module.exports = router;