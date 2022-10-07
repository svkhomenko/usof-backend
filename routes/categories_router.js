const express = require("express");
const categoriesController = require('../controllers/categories_controllers/categories_controller');
const isAdmin = require("../middleware/isAdmin");
const categoriesRouter = express.Router();

categoriesRouter.get("/", categoriesController.getAllCategories);
categoriesRouter.get("/:category_id", categoriesController.getCategoryById);
categoriesRouter.get("/:category_id/posts", categoriesController.getCategoryPostsById);
categoriesRouter.post("/", isAdmin, categoriesController.createNewCategory);
categoriesRouter.patch("/:category_id", isAdmin, categoriesController.updateCategoryData);
categoriesRouter.delete("/:category_id", isAdmin, categoriesController.deleteCategory);

module.exports = categoriesRouter;

