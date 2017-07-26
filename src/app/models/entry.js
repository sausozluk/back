var mongoose = require("mongoose");

var Id = require(__dirname + '/id');

var Entry = new mongoose.Schema({
  id: {type: Number},
  user: {type: ObjectId, ref: 'User', required: true},
  topic: {type: ObjectId, ref: 'Topic', required: true},
  up: [{type: ObjectId, ref: 'User'}],
  down: [{type: ObjectId, ref: 'User'}],
  text: {type: String, required: true, trim: true}
}, {
  collection: "entries",
  minimize: false,
  versionKey: false,
  timestamps: true
});

Entry.pre('save', function (next) {
  Id.findOneAndUpdate(
    {name: 'entries_inc'},
    {$inc: {value: 1}})
    .then((function (id) {
      this.id = id.value;
      next();
    }).bind(this));
});

Entry.index({text: 'text'});

mongoose.model("Entry", Entry);