var mongoose = require("mongoose");

var Message = new mongoose.Schema({
  message: {type: String, required: true},
  user: {type: ObjectId, ref: "User", required: true}
}, {
  collection: "messages",
  minimize: false,
  versionKey: false,
  timestamps: true
});

Message.index({message: 'text'});

mongoose.model("Message", Message);