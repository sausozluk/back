var mongoose = require("mongoose");

var Setting = new mongoose.Schema({
  key: {type: String, unique: true, required: true, trim: true},
  value: {type: String, required: true, trim: true},
  description: {type: String, require: true, trim: true}
}, {
  collection: "settings",
  minimize: false,
  versionKey: false,
  timestamps: false
});

module.exports = mongoose.model("Setting", Setting);