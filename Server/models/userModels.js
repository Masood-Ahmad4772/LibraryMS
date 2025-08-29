const mongoose = require("mongoose");

const userTypeSchema = new mongoose.Schema({
  name: { type: "String", required: true, unique: true },
  validFlag: { type: Boolean, default: true },
});
const userType = mongoose.model("UserType", userTypeSchema);

const signupSchema = new mongoose.Schema({
  name: { type: "String", required: true },
  userName: { type: "String", required: true, unique: true },
  password: { type: "String", required: true },
  userType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserType",
    required: true,
  },
  email: { type: "String", required: true, unique: true },
  validFlag: { type: Boolean, default: true },
  lastActivity: { type: Date, default: Date.now }, // Stores the last activity timestamp
});
const Signup = mongoose.model("Signup", signupSchema);

module.exports = { userType, Signup };
