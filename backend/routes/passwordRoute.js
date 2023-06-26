const express = require("express");
const router = require("express").Router();

const { sendResetPasswordLinkCtrl, getResetPasswordLinkCtrl, resetPasswordCtrl } = require("../Controllers/passwordController");
const asyncHandler = require("express-async-handler");

// /api/password/reset-password-link
router.post("/reset-password-link", asyncHandler(sendResetPasswordLinkCtrl));

// /api/password/reset-password/:userId/:token
router
  .route("/reset-password/:userId/:token") 
  .get(asyncHandler(getResetPasswordLinkCtrl))
  .post(asyncHandler(resetPasswordCtrl));

module.exports = router;
