const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AccountSchema = require("../schemas/Account");
const ProfileSchema = require("../schemas/Profile");
const bcrypt = require("bcrypt");

const UserModel = new Schema(
  {
    account: AccountSchema,
    profile: ProfileSchema,
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { versionKey: false }
);

UserModel.pre("save", async function (next) {
  const user = this;

  const structFirstName =
    user.account.firstName[0].toUpperCase() + user.account.firstName.slice(1);
  const structLastName =
    user.account.lastName[0].toUpperCase() + user.account.lastName.slice(1);

  user.account.firstName = structFirstName;
  user.account.lastName = structLastName;

  if (
    user.isModified("account.password") &&
    user.account.password.length < 257
  ) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.account.password, salt);
    user.account.password = hashedPassword;
  }
  next();
});

UserModel.post("save", function (error, doc, next) {
  const user = this;
  console.log(user);
  console.log(error);
  if (error.code === 11000) {
    next(
      new Error(
        `An account with email '${user.account.email}' already exists. Please choose a different email or sign in to your account.`
      )
    );
  }
  if (error.errors["account.firstName"]) {
    if (error.errors["account.firstName"].kind === "required") {
      next(new Error(`firstName is required.`));
    }
    if (error.errors["account.firstName"].kind === "maxlength") {
      next(new Error(`firstName cannot be more than 32 characters.`));
    }
    if (error.errors["account.firstName"].kind === "regexp") {
      next(new Error(`firstName cannot contain any whitespaces.`));
    }
  }
  if (error.errors["account.lastName"]) {
    if (error.errors["account.lastName"].kind === "required") {
      next(new Error(`lastName is required.`));
    }
    if (error.errors["account.lastName"].kind === "maxlength") {
      next(new Error(`lastName cannot be more than 32 characters.`));
    }
    if (error.errors["account.lastName"].kind === "regexp") {
      next(new Error(`lastName cannot contain any whitespaces.`));
    }
  }

  if (error.errors["account.email"]) {
    if (error.errors["account.email"].kind === "required") {
      next(new Error(`email is required.`));
    }
    if (error.errors["account.email"].kind === "maxlength") {
      next(new Error(`email cannot be more than 32 characters.`));
    }
    if (error.errors["account.email"].kind === "minlength") {
      next(new Error(`email cannot be less than 6 characters.`));
    }
    if (error.errors["account.email"].kind === "regexp") {
      next(new Error(`email is not valid. Please enter a valid email.`));
    }
  }
  if (error.errors["account.password"]) {
    if (error.errors["account.password"].kind === "required") {
      next(new Error(`password is required.`));
    }
    if (error.errors["account.password"].kind === "maxlength") {
      next(new Error(`password cannot be more than 256 characters.`));
    }
    if (error.errors["account.password"].kind === "minlength") {
      next(new Error(`password cannot be less than 8 characters.`));
    }
    if (error.errors["account.password"].kind === "regexp") {
      next(
        new Error(
          `password must meet all the following requirements: Password must not contain any whitespaces. Password must contain atleast one uppercase letter. Password must contain atleast one lowercase letter, Password must contain atleast one digit, Password must contain atleast one special character. Password must be 8-256 characters long.`
        )
      );
    }
  }

  if (error.errors["account.role"]) {
    if (error.errors["account.role"].kind === "required") {
      next(new Error(`role is required.`));
    }
    if (error.errors["account.role"].kind === "enum") {
      next(
        new Error(
          `role can only be assigned as either Superuser, Admin, Staff, Client, or Subscriber.`
        )
      );
    }
  } else {
    next();
  }
});

const User = mongoose.model("User", UserModel);
module.exports = User;
