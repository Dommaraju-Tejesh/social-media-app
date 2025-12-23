const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar:   { type: String }, // image path
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret:  { type: String } // speakeasy base32 secret
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
