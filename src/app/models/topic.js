var mongoose = require("mongoose");
var getSlug = require('speakingurl');
var slug = function (str) {
  return getSlug(str, {
    lang: 'tr',
    symbols: false
  });
};

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
        var v_b = v.replace(new RegExp('\'', 'g'), '');

        if (v_b === '') {
          return false;
        }

        return v.trim().length && v.trim().length < 51 && /^[a-zA-Z $0-9ığüşöçİĞÜŞÖÇ.']+$/.test(v);
      },
      message: "bu konuyla bi yere varamazsın"
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