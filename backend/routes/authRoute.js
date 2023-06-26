// const router = require("express").Router();
// const { registerUserCtrl, loginUserCtrl, verifyUserAccountCtrl } = require("../Controllers/authController");
const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {
  registerUserCtrl,
  loginUserCtrl,
  verifyUserAccountCtrl,
} = require("../Controllers/authController");


// // /api/auth/register
// router.post("/register", registerUserCtrl );

// // /api/auth/login
// router.post("/login", loginUserCtrl );

// // /api/auth/:userId/verify/:token
// router.get("/:userId/verify/:token",verifyUserAccountCtrl);


// Register new user
router.post("/register", asyncHandler(registerUserCtrl));

// Login user
router.post("/login", asyncHandler(loginUserCtrl));

// Verify user account
router.get("/:userId/verify/:token", asyncHandler(verifyUserAccountCtrl));

module.exports = router;