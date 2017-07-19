var mongoose = require("mongoose");
var utils = require(__dirname + "/../../libs/utils");
var getSlug = require('speakingurl');
var sha512 = require("js-sha512").sha512;
var randomToken = require("rand-token");
var slug = function (str) {
  return getSlug(str, {
    lang: 'tr',
    symbols: false
  });
};

var User = new mongoose.Schema({
  "username": {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        var length = v.trim().length;
        return length > 0 && length < 41 && /^[a-zA-Z $0-9ığüşöçİĞÜŞÖÇ]+$/.test(v);
      },
      message: "kullanıcı adı uygunsuz :p"
    }
  },
  "slug": {
    type: String,
    default: "",
    unique: true,
    lowercase: true,
    trim: true
  },
  "permission": {
    type: Number,
    enum: $enum("user.permission", true),
    default: 0
  },
  "email": {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    default: "",
    required: true,
    validate: {
      validator: function (v) {
        return utils.emailPattern.test(v);
      },
      message: "böyle mail mi olur, açık adres vereydin?"
    }
  },
  "password": {
    type: String,
    required: true,
    set: function (password) {
      return sha512(password);
    }
  },
  "tokens": [String],
  "keys": {
    "activation": {
      type: String,
      unique: true,
      trim: true,
      required: true
    },
    "mailChange": {
      "key": {
        type: String,
        unique: true,
        trim: true,
        required: true
      },
      "mail": {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
        validate: {
          validator: function (v) {
            return utils.emailPattern.test(v);
          },
          message: "böyle mail mi olur, açık adres vereydin?"
        }
      }
    }
  },
  "active": {type: Boolean, default: !$isProd},
  "banned": {type: Boolean, default: false},
  "moderation": [String],
  generation: {
    type: String,
    trim: true
  }
}, {
  collection: "users",
  minimize: false,
  versionKey: false,
  timestamps: true
});

User.pre('save', function (next) {
  $generation.get((function (current) {
    this.generation = current;
    this.slug = slug(this.username);
    this.tokens.push(randomToken.generate(32));
    next();
  }).bind(this));
});

User.index({username: 'text'});

mongoose.model("User", User);