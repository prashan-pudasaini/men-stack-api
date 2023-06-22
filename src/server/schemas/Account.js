const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 32,
      match: /^\S*$/,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 32,
      match: /^\S*$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxLength: 32,
      minLength: 6,
      lowercase: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 256,
      match:
        /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()-+]).{8,256}$/,
    },
    role: {
      type: String,
      required: true,
      enum: ["Superuser", "Admin", "Staff", "Client", "Subscriber"],
      default: "Subscriber",
    },
    dateRegistered: {
      type: String,
      required: true,
      defualt: Date.now,
    },
  },
  { _id: false }
);

module.exports = AccountSchema;
