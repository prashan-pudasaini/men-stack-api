const User = require("../models/User");
const usersService = require("../services/usersService");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

const createUser = async (req, res) => {
  if (
    !(
      Object.keys(req.body).includes("firstName") &&
      Object.keys(req.body).includes("lastName") &&
      Object.keys(req.body).includes("email") &&
      Object.keys(req.body).includes("password") &&
      Object.keys(req.body).includes("confirmPassword")
    )
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message:
        "firstName, lastName, email, password, and confirmPassword is required.",
    });
  }

  if (Object.keys(req.body).length !== 5) {
    return res.status(400).json({
      status: 400,
      succes: false,
      message:
        "firstName, lastName, email, password, and confirmPassword is required.",
    });
  }
  if (req.body.password.length > 256) {
    return res.status(400).json({
      status: 400,
      succes: false,
      message: "password cannot be more than 256 characters long.",
    });
  }

  if (req.body.password.length < 8) {
    return res.status(400).json({
      status: 400,
      succes: false,
      message: "password cannot be less than 8 characters long.",
    });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({
      status: 400,
      succes: false,
      message: "password and confirmPassword does not match.",
    });
  } else
    try {
      const user = await usersService.createUser(
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.password,
        "",
        "",
        ""
      );
      return res.status(201).json({ status: 201, succes: true, user: user });
    } catch (error) {
      return res
        .status(400)
        .json({ status: 400, success: false, message: error.message });
    }
};

const readAllUsers = async (req, res) => {
  if (
    res.body.account.role === "Superuser" ||
    res.body.account.role === "Admin" ||
    res.body.account.role === "Staff"
  ) {
    const allUsers = await usersService.readAllUsers();
    if (allUsers.length === 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: `There are no any users.`,
      });
    }
    return res
      .status(200)
      .json({ status: 200, success: true, users: allUsers });
  } else {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have either a Superuser, Admin, or Staff privilege to perform this operation.`,
    });
  }
};

const readUser = async (req, res) => {
  try {
    const userDetail = await usersService.readUser(req.params.id);
    if (userDetail === null) {
      return res
        .status(404)
        .json({ status: 404, success: false, message: `User does not exist.` });
    }
    return res
      .status(200)
      .json({ status: 200, success: true, user: userDetail });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ status: 400, success: false, message: `Invalid user ID.` });
    } else {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `Something went wrong. ${error.message}`,
      });
    }
  }
};

const updateName = async (req, res) => {
  try {
    if (req.params.id === res.body._id.toString()) {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `firstName, and lastName is required.`,
        });
      }
      if (Object.keys(req.body).length > 2) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `firstName, and lastName is required.`,
        });
      }
      if (
        Object.keys(req.body).includes("firstName") &&
        Object.keys(req.body).includes("lastName")
      ) {
        const nameUpdate = await usersService.updateName(
          req.params.id,
          req.body.firstName,
          req.body.lastName
        );
        if (!nameUpdate) {
          return res.status(404).json({
            status: 404,
            success: false,
            message: `User does not exist.`,
          });
        }
        return res.status(200).json({
          status: 200,
          success: true,
          message: `Your name has been updated`,
          user: nameUpdate,
        });
      } else {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `firstName, and lastName is required.`,
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `You do not have sufficient privilege to perform this operation.`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: `Something went wrong. ${error.message}`,
    });
  }
};

const updateEmail = async (req, res) => {
  try {
    if (req.params.id === res.body._id.toString()) {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `email and password is required to change the email.`,
        });
      }
      if (Object.keys(req.body).length > 2) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `email and password is required to change the email.`,
        });
      }
      if (
        Object.keys(req.body).includes("email") &&
        Object.keys(req.body).includes("password")
      ) {
        if (!req.body.password) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: `password cannot be blank.`,
          });
        }
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          res.body.account.password
        );
        if (!passwordIsValid) {
          return res.status(401).json({
            status: 401,
            success: false,
            messge: `password is not correct.`,
          });
        }
        const emailUpdate = await usersService.updateEmail(
          req.params.id,
          req.body.email
        );
        if (!emailUpdate) {
          return res.status(404).json({
            status: 404,
            success: false,
            message: `User does not exist.`,
          });
        }
        return res.status(200).json({
          status: 200,
          success: true,
          message: `Your email has been updated.`,
          user: emailUpdate,
        });
      } else {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `Please provide a valid email and password to update your email.`,
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `You do not have sufficient privilege to perform this operation.`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: `Something went wrong. ${error.message}`,
    });
  }
};

const updateRole = async (req, res) => {
  try {
    if (res.body.account.role === "Superuser") {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `role and password is required to change the role.`,
        });
      }
      if (Object.keys(req.body).length > 2) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `role and password is required to change the role.`,
        });
      }
      if (
        Object.keys(req.body).includes("role") &&
        Object.keys(req.body).includes("password")
      ) {
        if (!req.body.password) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: `password cannot be blank.`,
          });
        }
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          res.body.account.password
        );
        if (!passwordIsValid) {
          return res.status(401).json({
            status: 401,
            success: false,
            messge: `password is not correct.`,
          });
        }
        const roleUpdate = await usersService.updateRole(
          req.params.id,
          req.body.role
        );
        if (!roleUpdate) {
          return res.status(404).json({
            status: 404,
            success: false,
            message: `User does not exist.`,
          });
        }
        return res.status(200).json({
          status: 200,
          success: true,
          message: `The user's role has been updated.`,
          user: roleUpdate,
        });
      } else {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `Please provide a valid role and password to update the role.`,
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        succes: false,
        message: `You must have a superuser privilege to perform this operation.`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: `Something went wrong. ${error.message}`,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    if (req.params.id === res.body._id.toString()) {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `oldPassword, newPassword, confirmNewPassword is required to change the password.`,
        });
      }
      if (Object.keys(req.body).length > 3) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `oldPassword, newPassword, confirmNewPassword is required to change the password.`,
        });
      }
      if (
        Object.keys(req.body).includes("oldPassword") &&
        Object.keys(req.body).includes("newPassword") &&
        Object.keys(req.body).includes("confirmNewPassword")
      ) {
        if (!req.body.oldPassword) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: `oldPassword cannot be blank.`,
          });
        }
        if (!req.body.newPassword) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: `newPassword cannot be blank.`,
          });
        }
        if (!req.body.confirmNewPassword) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: `confirmNewPassword cannot be blank.`,
          });
        }
        if (req.body.newPassword.length > 256) {
          return res.status(400).json({
            status: 400,
            succes: false,
            message: "password cannot be more than 256 characters long.",
          });
        }

        if (req.body.newPassword.length < 8) {
          return res.status(400).json({
            status: 400,
            succes: false,
            message: "password cannot be less than 8 characters long.",
          });
        }
        if (req.body.newPassword !== req.body.confirmNewPassword) {
          return res.status(400).json({
            status: 400,
            succes: false,
            message: "newPassword and confirmNewPassword does not match.",
          });
        }
        const passwordIsValid = bcrypt.compareSync(
          req.body.oldPassword,
          res.body.account.password
        );
        if (!passwordIsValid) {
          return res.status(401).json({
            status: 401,
            success: false,
            messge: `oldPassword is not correct.`,
          });
        }
        const passwordUpdate = await usersService.updatePassword(
          req.params.id,
          req.body.newPassword
        );
        if (!passwordUpdate) {
          return res.status(404).json({
            status: 404,
            success: false,
            message: `User does not exist.`,
          });
        }
        return res.status(200).json({
          status: 200,
          success: true,
          message: `Your password has been updated.`,
          user: passwordUpdate,
        });
      } else {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `Please provide oldPassword, newPassword, and confirmNewPassword to update your password.`,
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `You do not have sufficient privilege to perform this operation.`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: `Something went wrong. ${error.message}`,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    if (req.params.id === res.body._id.toString()) {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `jobTitle, and bio is required.`,
        });
      }
      if (Object.keys(req.body).length > 2) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `jobTitle, and bio is required.`,
        });
      }
      if (
        Object.keys(req.body).includes("jobTitle") &&
        Object.keys(req.body).includes("bio")
      ) {
        const profileUpdate = await usersService.updateProfile(
          req.params.id,
          req.body.jobTitle,
          req.body.bio
        );
        if (!profileUpdate) {
          return res.status(404).json({
            status: 404,
            success: false,
            message: `User does not exist.`,
          });
        }
        return res.status(200).json({
          status: 200,
          success: true,
          message: `Your profile has been updated`,
          user: profileUpdate,
        });
      } else {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `jobTitle, and bio is required.`,
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `You do not have sufficient privilege to perform this operation.`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: `Something went wrong. ${error.message}`,
    });
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (req.params.id === res.body._id.toString()) {
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, `src/server/uploads/users/avatar`);
        },
        filename: function (req, file, cb) {
          const formattedDate = new Date()
            .toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .replace(/\//g, "-")
            .replace(/,/, "-")
            .replace(/\s+/g, "-")
            .replace(/[ :]+/g, "-")
            .replace(/--/, "-");

          cb(
            null,
            res.body.account.firstName.toLowerCase() +
              "-" +
              res.body.account.lastName.toLowerCase() +
              "-" +
              formattedDate.toLowerCase() +
              path.extname(file.originalname)
          );
        },
      });
      const upload = multer({
        storage: storage,
        limits: { fileSize: 1000000 },
        fileFilter: function (req, file, cb) {
          if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/png"
          ) {
            cb(null, true);
          } else {
            return res.status(400).json({
              status: 400,
              success: false,
              message: `File must be a jpeg, jpg, or png file.`,
            });
          }
        },
      });
      upload.single("avatar")(req, res, function (error) {
        if (error) {
          if (error.message === "Unexpected field") {
            return res.status(400).json({
              status: 400,
              success: false,
              message: `avatar is required.`,
            });
          }
          if (error.message === "File too large") {
            return res.status(400).json({
              status: 400,
              success: false,
              message: `File size cannot be more than 1MB.`,
            });
          }
          return res.status(400).json({
            status: 400,
            success: false,
            message: `Something went wrong. ${error.message}`,
          });
        } else {
          usersService
            .updateAvatar(req.params.id, req.file.path)
            .then((resp) => {
              return res.status(200).json({
                status: 200,
                success: true,
                message: `Your avatar has been updated.`,
                user: resp,
              });
            })
            .catch((error) => {
              return res.status(400).json({
                status: 400,
                success: false,
                message: `Something went wrong. ${error.message}`,
              });
            });
        }
      });
    } else {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `You do not have sufficient privilege to perform this operation.`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: `Somthing went wrong. ${error.message}`,
    });
  }
};

const deleteUsers = async (req, res) => {
  try {
    if (res.body.account.role === "Superuser") {
      const deletedCount = await usersService.deleteUsers(req.body);
      if (deletedCount.deletedCount === 0) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: `User does not exist.`,
        });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: `${deletedCount.deletedCount} users have been deleted.`,
      });
    } else {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `You must be a superuser to perform this operation.`,
      });
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `Invalid user ID. ${error}`,
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
  createUser,
  readAllUsers,
  readUser,
  updateName,
  updateEmail,
  updateRole,
  updatePassword,
  updateProfile,
  updateAvatar,
  deleteUsers,
};
