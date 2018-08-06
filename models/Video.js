const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const VideoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  company: {
    type: String
  },
  a_name: {
    type: [String],
    required: true
  },
  videoId: {
    type: String
  },
  title: {
    type: String
  },
  details: {
    type: String
  },
  thumbnail: {
    type: String
  },
  url: {
    type: String
  },
  year: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
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
        type: String
      },
      name: {
        type: String
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
module.exports = Video = mongoose.model("video", VideoSchema);
