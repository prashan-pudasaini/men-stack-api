const bcrypt = require("bcrypt");
const authService = require("../services/authService");

const loginUser = async (req, res) => {
  if (Object.keys(req.body).length !== 2) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "email and password is required.",
    });
  }
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "email and password is required.",
    });
  } else {
    try {
      const user = await authService.loginUser(
        req.body.email,
        req.body.password
      );
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Login successful",
        user: user,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `Something went wrong. ${error.message}`,
      });
    }
  }
};

const authUser = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: `You must be authenticated to perform this operation.`,
    });
  }
  try {
    const userDetail = await authService.authUser(
      req.headers.authorization.split(" ")[1]
    );
    if (!userDetail) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `Your session is no longer valid. Please log in again to continue.`,
      });
    }
    res.body = userDetail;
    next();
  } catch (error) {
    if (error.message === "TokenExpiredError: jwt expired") {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Your session has expired. Please log in again to continue.",
      });
    }
    return res.status(400).json({
      status: 400,
      success: false,
      message: `Something went wrong. ${error.message}`,
    });
  }
};

module.exports = {
  loginUser,
  authUser,
};
