var mongoose = require("mongoose");

var Report = new mongoose.Schema({
  user: {type: ObjectId, ref: 'User', required: true},
  entry: {type: Number, required: true}
}, {
  collection: "reports",
  minimize: false,
  versionKey: false,
  timestamps: true,
  usePushEach: true
});

mongoose.model("Report", Report);