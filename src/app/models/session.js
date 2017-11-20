var mongoose = require("mongoose");

var Session = new mongoose.Schema({
  remote_ip: {type: String, required: true},
  local_ip: {type: String, required: true},
  user_agent: {type: String, required: true},
  user: {type: ObjectId, ref: 'User', required: true},
  token: {type: String, required: true},
  active: {type: Boolean, required: true}
}, {
  collection: "sessions",
  minimize: false,
  versionKey: false,
  timestamps: true
});

mongoose.model("Session", Session);