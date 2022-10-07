const express = require("express");
const authController = require('../controllers/auth_controllers/auth_controller');
const isAuth = require("../middleware/isAuth");
const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/email-confirmation/:confirm_token", authController.confirmEmail);
authRouter.post("/login", authController.login);
authRouter.post("/logout", isAuth, authController.logout);
authRouter.post("/password-reset", authController.sendPasswordConfirmation);
authRouter.post("/password-reset/:confirm_token", authController.confirmPassword);

module.exports = authRouter;

