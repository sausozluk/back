var mongoose = require("mongoose");
var slug = require('slug');

var Id = require(__dirname + '/id');

var Topic = new mongoose.Schema({
  id: {type: Number},
  "title": {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return v.trim().length && v.trim().length < 51;
      },
      message: "50 karakter uzun olamaz la"
    }
  },
  "slug": {
    type: String,
    default: "",
    lowercase: true,
    trim: true
  },
  "entries": [{type: ObjectId, ref: 'Entry'}]
}, {
  collection: "topics",
  minimize: false,
  versionKey: false,
  timestamps: true
});

Topic.statics.random = function (next) {
  this.count(function (err, count) {
    if (err) return next(err);
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(next);
  }.bind(this));
};

Topic.pre('save', function (next) {
  Id.findOneAndUpdate(
    {name: 'topics_inc'},
    {$inc: {value: 1}})
    .then((function (id) {
      this.slug = slug(this.title);
      this.id = id.value;
      next();
    }).bind(this));
});

Topic.index({title: 'text'});

mongoose.model("Topic", Topic);