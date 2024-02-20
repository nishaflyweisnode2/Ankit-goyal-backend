const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  phone: {
    type: String,
  },
  otp: {
    type: String
  },
  otpExpiration: {
    type: Date,
  },
  emailOtp: {
    type: String
  },
  emailExpiration: {
    type: Date,
  },
  accountVerification: {
    type: Boolean,
    default: false,
  },
  emailVerification: {
    type: Boolean,
    default: false,
  },
  completeProfile: {
    type: Boolean,
    default: false,
  },
  fullName: {
    type: String
  },
  dob: {
    type: String
  },
  gender: {
    type: String
  },
  state: {
    type: String
  },
  city: {
    type: String
  },
  socialId: {
    type: String
  },
  socialType: {
    type: String
  },
  password: {
    type: String
  },
  email: {
    type: String,
  },
  panNumber: {
    type: String
  },
  panName: {
    type: String
  },
  panImage: {
    type: String
  },
  refferalCode: { type: String, },
  refferUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  joinUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  userType: {
    type: String,
    enum: ["User", "Admin"],
    default: "User"
  },
  wallet: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
},
  { timestamps: true }

);

module.exports = mongoose.model("User", userSchema);