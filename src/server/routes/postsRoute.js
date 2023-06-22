const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const postsController = require("../controllers/postsController");

router.post(
  "/post/create",
  authController.authUser,
  postsController.createPost
);
router.get("/posts", postsController.readAllPosts);
router.get("/post/:slug", postsController.readPost);
router.put("/post/:id", authController.authUser, postsController.updatePost);
router.delete(
  "/post/delete/:id",
  authController.authUser,
  postsController.deletePosts
);
module.exports = router;
