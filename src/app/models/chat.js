var mongoose = require("mongoose");
var Message = require(__dirname + "/message");

var Chat = new mongoose.Schema({
  users: [{type: ObjectId, ref: 'User'}],
  messages: [Message],
  slug: {type: String, required: true, unique: true}
}, {
  collection: "chats",
  minimize: false,
  versionKey: false,
  timestamps: true
});

mongoose.model("Chat", Chat);