const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    jobTitle: {
      type: String,
    },
    bio: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  { _id: false }
);

module.exports = ProfileSchema;
