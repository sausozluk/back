var mongoose = require("mongoose");
var utils = require(__dirname + "/../../libs/utils");
var sha512 = require("js-sha512").sha512;

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
  "activities": [{
    action: {type: String, required: true},
    data: {type: mongoose.Schema.Types.Mixed},
    date: {type: Date, default: Date.now}
  }],
  "keys": {
    "activation": {
      type: String,
      unique: true,
      trim: true,
      required: true
    },
    "forgotPassword": {
      type: String,
      unique: true,
      trim: true
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
  "block": {
    "chat": {
      type: Boolean,
      default: false
    },
    "entry": {
      type: Boolean,
      default: false
    },
    "topic": {
      type: Boolean,
      default: false
    }
  },
  "active": {type: Boolean, default: !$isProd},
  "banned": {type: Boolean, default: false},
  "notes": {type: mongoose.Schema.Types.Mixed, default: {}},
  "moderation": [String],
  generation: {
    type: String,
    trim: true
  }
}, {
  collection: "users",
  minimize: false,
  versionKey: false,
  timestamps: true,
  usePushEach: true
});

User.index({username: 'text'});

mongoose.model("User", User);