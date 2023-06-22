const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");

router.post("/auth/login", authController.loginUser);
router.post("/auth/register", usersController.createUser);
router.get("/users", authController.authUser, usersController.readAllUsers);
router.get("/user/:id", usersController.readUser);
router.put(
  "/user/update/name/:id",
  authController.authUser,
  usersController.updateName
);
router.put(
  "/user/update/email/:id",
  authController.authUser,
  usersController.updateEmail
);
router.put(
  "/user/update/role/:id",
  authController.authUser,
  usersController.updateRole
);
router.put(
  "/user/update/password/:id",
  authController.authUser,
  usersController.updatePassword
);
router.put(
  "/user/update/profile/:id",
  authController.authUser,
  usersController.updateProfile
);
router.put(
  "/user/update/avatar/:id",
  authController.authUser,
  usersController.updateAvatar
);
router.post(
  "/users/delete",
  authController.authUser,
  usersController.deleteUsers
);

module.exports = router;
