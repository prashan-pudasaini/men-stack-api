const categoriesService = require("../services/categoriesService");

const createCategory = async (req, res) => {
  if (
    res.body.account.role === "Superuser" ||
    res.body.account.role === "Admin" ||
    res.body.account.role === "Staff"
  ) {
    if (
      !(
        Object.keys(req.body).includes("slug") &&
        Object.keys(req.body).includes("name")
      )
    ) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `category slug, and name is required.`,
      });
    }
    if (Object.keys(req.body).length !== 2) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `category slug, and name is required.`,
      });
    } else {
      try {
        const category = await categoriesService.createCategory(
          req.body.slug,
          req.body.name
        );
        return res.status(201).json({
          status: 201,
          success: true,
          message: `Category '${req.body.name}' has been created.`,
          category: category,
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
      message: `You do not have sufficient provilege to perform this operation.`,
    });
  }
};

const readCategory = async (req, res) => {
  const categoryDetail = await categoriesService.readCategory(req.params.slug);
  if (categoryDetail === null) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `Category does not exist.`,
    });
  }
  return res
    .status(200)
    .json({ status: 200, success: true, category: categoryDetail });
};

const readAllCategories = async (req, res) => {
  const allCategories = await categoriesService.readAllCategories();
  if (allCategories.length === 0) {
    return res.status(200).json({
      status: 200,
      success: true,
      message: `There are no any categories.`,
    });
  }
  return res
    .status(200)
    .json({ status: 200, success: true, categories: allCategories });
};

const updateCategory = async (req, res) => {
  try {
    if (
      res.body.account.role === "Superuser" ||
      res.body.account.role === "Admin" ||
      res.body.account.role === "Staff"
    ) {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `category name and slug is required.`,
        });
      }
      if (Object.keys(req.body).length > 2) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `category name and slug is required.`,
        });
      }
      if (
        Object.keys(req.body).includes("slug") &&
        Object.keys(req.body).includes("name")
      ) {
        const categoryUpdate = await categoriesService.updateCategory(
          req.params.id,
          req.body.slug,
          req.body.name
        );
        if (!categoryUpdate) {
          return res.status(404).json({
            status: 404,
            success: false,
            message: `Category does not exist.`,
          });
        }
        return res.status(200).json({
          status: 200,
          success: true,
          message: `Category has been updated`,
          updatedCategory: categoryUpdate,
        });
      } else {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `slug, and name is required.`,
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

const deleteCategories = async (req, res) => {
  try {
    if (
      res.body.account.role === "Superuser" ||
      res.body.account.role === "Admin" ||
      res.body.account.role === "Staff"
    ) {
      const deletedCount = await categoriesService.deleteCategories(req.body);
      if (deletedCount.deletedCount === 0) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: `Category does not exist.`,
        });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: `${deletedCount.deletedCount} categories have been deleted.`,
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
        message: `Invalid category ID. ${error}`,
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
  createCategory,
  readCategory,
  readAllCategories,
  updateCategory,
  deleteCategories,
};
