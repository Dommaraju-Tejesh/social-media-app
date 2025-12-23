const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text:   String
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    users:    [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // two users
    messages: [messageSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
