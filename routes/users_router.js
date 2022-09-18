const express = require("express");
const usersController = require('../controllers/users_controllers/users_controller');
const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");
const canUpdateUserData = require("../middleware/canUpdateUserData");
const usersRouter = express.Router();

usersRouter.get("/", isAuth, usersController.getAllUsers);
usersRouter.get("/:user_id", isAuth, usersController.getUserById);
usersRouter.post("/", isAdmin, usersController.createNewUser);
// usersRouter.patch("/avatar", isAuth, usersController.uploadAvatar);
// usersRouter.patch("/:user_id", canUpdateUserData, usersController.uploadUserData);
usersRouter.delete("/:user_id", canUpdateUserData, usersController.deleteUser);

module.exports = usersRouter;

