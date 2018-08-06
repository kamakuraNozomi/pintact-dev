const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CompanySchama = new Schema({
  c_name: {
    type: String,
    isRuired: true
  },
  c_website: {
    type: String
  },
  // 同じ会社の登録ユーザー
  member: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  // actor_idを発行
  actors: [
    {
      a_name: {
        type: String
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user"
      },
      text: {
        type: String,
        required: true
      },
      cnt: {
        type: Number
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Company = mongoose.model("company", CompanySchama);
