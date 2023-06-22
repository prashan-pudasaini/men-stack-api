const postsService = require("../services/postsService");

const createPost = async (req, res) => {
  if (
    res.body.account.role === "Superuser" ||
    res.body.account.role === "Admin" ||
    res.body.account.role === "Staff"
  ) {
    if (
      !(
        Object.keys(req.body).includes("title") &&
        Object.keys(req.body).includes("excerpt") &&
        Object.keys(req.body).includes("body") &&
        Object.keys(req.body).includes("readTime") &&
        Object.keys(req.body).includes("category") &&
        Object.keys(req.body).includes("slug") &&
        Object.keys(req.body).includes("status") &&
        Object.keys(req.body).includes("visibility")
      )
    ) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `title, excerpt, body, readTime, category, slug, status, and visibility  is required.`,
      });
    }
    if (Object.keys(req.body).length !== 8) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `title, excerpt, body, readTime, category, slug, status, and visibility  is required.`,
      });
    } else {
      try {
        const authorId = res.body._id;
        const post = await postsService.createPost(
          authorId,
          req.body.slug,
          req.body.title,
          req.body.excerpt,
          req.body.body,
          req.body.readTime,
          req.body.category,
          req.body.status,
          req.body.visibility
        );

        return res.status(201).json({
          status: 201,
          success: true,
          message: `Post has been created.`,
          post: post,
        });
      } catch (error) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `Something went wrong. ${error.message}`,
        });
      }
    }
  } else {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You do not have sufficient privilege to perform this operation.`,
    });
  }
};

const readAllPosts = async (req, res) => {
  const allPosts = await postsService.readAllPosts();
  if (allPosts.length === 0) {
    return res.status(200).json({
      status: 200,
      success: true,
      message: `There are no any posts.`,
    });
  }
  return res.status(200).json({ status: 200, success: true, posts: allPosts });
};

const readPost = async (req, res) => {
  const postDetail = await postsService.readPost(req.params.slug);
  if (postDetail === null) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `Post with that slug does not exist.`,
    });
  }
  return res.status(200).json({ status: 200, success: true, post: postDetail });
};

const updatePost = async (req, res) => {
  if (
    res.body.account.role === "Superuser" ||
    res.body.account.role === "Admin" ||
    res.body.account.role === "Staff"
  ) {
    if (
      !(
        Object.keys(req.body).includes("title") &&
        Object.keys(req.body).includes("excerpt") &&
        Object.keys(req.body).includes("body") &&
        Object.keys(req.body).includes("readTime") &&
        Object.keys(req.body).includes("category") &&
        Object.keys(req.body).includes("slug") &&
        Object.keys(req.body).includes("status") &&
        Object.keys(req.body).includes("visibility")
      )
    ) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `title, excerpt, body, readTime, category, slug, status, and visibility  is required.`,
      });
    }
    if (Object.keys(req.body).length !== 8) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `title, excerpt, body, readTime, category, slug, status, and visibility  is required.`,
      });
    } else {
      try {
        const postUpdate = await postsService.updatePost(
          req.params.id,
          req.body.title,
          req.body.slug,
          req.body.excerpt,
          req.body.body,
          req.body.readTime,
          req.body.category,
          req.body.status,
          req.body.visibility
        );
        if (!postUpdate) {
          return res.status(404).json({
            status: 404,
            success: false,
            message: `Post does not exist`,
          });
        }
        return res.status(200).json({
          status: 200,
          success: true,
          message: `Post has been updated`,
          updatedPost: postUpdate,
        });
      } catch (error) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `Something went wrong. ${error.message}`,
        });
      }
    }
  } else {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You do not have sufficient privilege to perform this operation.`,
    });
  }
};

const deletePosts = async (req, res) => {
  try {
    if (
      res.body.account.role === "Superuser" ||
      res.body.account.role === "Admin" ||
      res.body.account.role === "Staff"
    ) {
      await postsService.deletePosts(req.params.id);

      return res.status(200).json({
        status: 200,
        success: true,
        message: `Post have been deleted.`,
      });
    } else {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `You must be a superuser or admin or staff to perform this operation.`,
      });
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `Invalid post ID. ${error}`,
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
  createPost,
  readAllPosts,
  readPost,
  updatePost,
  deletePosts,
};
