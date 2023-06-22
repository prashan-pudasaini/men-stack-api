const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const categoriesController = require("../controllers/categoriesController");

router.post(
  "/category/create",
  authController.authUser,
  categoriesController.createCategory
);
router.get("/category/:slug", categoriesController.readCategory);
router.get("/categories", categoriesController.readAllCategories);
router.put(
  "/category/:id",
  authController.authUser,
  categoriesController.updateCategory
);
router.post(
  "/categories/delete",
  authController.authUser,
  categoriesController.deleteCategories
);

module.exports = router;
