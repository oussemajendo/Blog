const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, ValidateEmail, ValidateNewPassword } = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const VerificationToken = require("../models/VerificationToken");

// ...Rest of the code...

module.exports.sendResetPasswordLinkCtrl = asyncHandler(async (req, res) => {
  // Validation
  const { error } = ValidateEmail(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // Get the user from DB by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "User with given email does not exist!" });
  }
  // Creating VerificationToken
  let verificationToken = await VerificationToken.findOne({ userId: user._id });
  if (!verificationToken) {
    verificationToken = new VerificationToken({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex")
    });
    await verificationToken.save();
  }
  // Creating Link
  const link = `${process.env.CLIENT_DOMAIN}/reset-password/${user._id}/${verificationToken.token}`;
  // Creating HTML Template
  const htmlTemplate = `<a href="${link}">Click here to reset your password</a>`;
  // Sending Email
  await sendEmail(user.email, "Reset Password", htmlTemplate);
  // Response to the client
  res.status(200).json({ message: "Password reset link sent to your email, please check your inbox" });
});

module.exports.getResetPasswordLinkCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "Invalid link" });
  }
  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid link" });
  }
  return res.status(200).json({ message: "Valid URL" });
});

module.exports.resetPasswordCtrl = asyncHandler(async (req, res) => {
  const { error } = ValidateNewPassword(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "Invalid link" });
  }
  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid link" });
  }
  if (!user.isAccountVerified) {
    user.isAccountVerified = true;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user.password = hashedPassword;
  await user.save();
  // Remove the old reset token
  await VerificationToken.deleteOne({ _id: verificationToken._id });

  res.status(200).json({ message: "Password reset successfully, please log in" });
});
