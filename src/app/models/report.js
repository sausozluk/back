var mongoose = require("mongoose");

var Report = new mongoose.Schema({
  username: {type: String, required: true},
  entry: {type: Number, required: true}
}, {
  collection: "reports",
  minimize: false,
  versionKey: false,
  timestamps: true
});

mongoose.model("Report", Report);