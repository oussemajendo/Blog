const mongoose = require("mongoose");

const verificationTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
});

const VerificationToken = mongoose.model("VerificationToken", verificationTokenSchema);

module.exports = VerificationToken;
