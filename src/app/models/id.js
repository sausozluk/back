var mongoose = require("mongoose");

var Id = new mongoose.Schema({
  name: {type: String, unique: true, required: true, trim: true},
  value: {type: Number, default: 1}
}, {
  collection: "ids",
  minimize: false,
  versionKey: false,
  timestamps: true
});

module.exports = mongoose.model("Id", Id);