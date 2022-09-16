const express = require("express");
const authController = require('../controllers/auth_controllers/auth_controller');
const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/email-confirmation", authController.sendEmailConfirmation);
authRouter.post("/email-confirmation/:confirm_token", authController.confirmEmail);
authRouter.post("/login", authController.login);
// authRouter.post("/logout", authController.getUsers);
// authRouter.post("/password-reset", authController.getUsers);
authRouter.post("/password-reset/:confirm_token", authController.confirmPassword);

module.exports = authRouter;

