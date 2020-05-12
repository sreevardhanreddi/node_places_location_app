const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  profilePic: { type: String, required: false },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: false, default: false },
  isActive: { type: Boolean, required: false, default: true },
  lastActivity: { type: Date, required: false, default: "" },
});

module.exports = mongoose.model("User", userSchema);
