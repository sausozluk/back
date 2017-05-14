var mongoose = require("mongoose");

var Chat = new mongoose.Schema({
  users: [{type: ObjectId, ref: 'User'}],
  messages: [{
    message: {type: String, required: true},
    user: {type: ObjectId, ref: "User", required: true},
    seen: {type: Boolean, default: false},
    date: {type: Date, default: Date.now}
  }],
  slug: {type: String, required: true, unique: true}
}, {
  collection: "chats",
  minimize: false,
  versionKey: false,
  timestamps: true
});

mongoose.model("Chat", Chat);