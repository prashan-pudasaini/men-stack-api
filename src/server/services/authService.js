const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const loginUser = async (email, password) => {
  const user = await User.findOne({ "account.email": email });
  if (!user) {
    throw new Error(`Could not find an account with that email.`);
  }
  const passwordIsValid = bcrypt.compareSync(password, user.account.password);
  if (!passwordIsValid) {
    throw new Error(`Password is not correct.`);
  }
  const token = jwt.sign({ user }, "secret", { expiresIn: 1440 * 60 });
  return {
    accessToken: token,
  };
};

const authUser = async (authHeader) => {
  if (!authHeader) {
    throw new Error(`Invalid request. Please provide the auth header`);
  }
  try {
    const decodedPayload = jwt.verify(authHeader, "secret");
    const userDetail = await User.findById(decodedPayload.user._id);
    return userDetail;
  } catch (error) {
    throw new Error(`Something went wrong. ${error.message}`);
  }
};

module.exports = {
  loginUser,
  authUser,
};
