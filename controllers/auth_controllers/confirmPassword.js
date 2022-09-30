const bcrypt  = require("bcrypt");
const path = require("path");
const fs  = require("fs");

const { verifyJWTToken, destroyJWTToken } = require('../../token/tokenTools');
const ValidationError = require('../../errors/ValidationError');
const { validatePassword } = require('../tools/dataValidation');

const db = require("../../models/init.js");
const User = db.sequelize.models.user;

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function confirmPassword(req, res) {
    const confirmToken = req.params.confirm_token;
    const { newPassword } = req.body; 

    try {
        const decoded = await verifyJWTToken(confirmToken, tokenOptions.secret_password);
        if (!decoded.email) {
            throw new ValidationError("Invalid token", 401);
        }

        await validatePassword(newPassword);

        let user = await User.findOne({
            where: {
                email: decoded.email
            },
        });
        if (!user) {
            throw new ValidationError("Invalid token", 401);
        }
        
        let salt = bcrypt.genSaltSync(10);
        user.set({
            encryptedPassword: bcrypt.hashSync(newPassword, salt)
        });
        user = await user.save();

        await destroyJWTToken(confirmToken);
        
        res.setHeader("Location", `/api/users/${user.id}`)
            .status(201).send();
    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(err.status)
                .json({ message: err.message });
        }
        else if (err.name == 'SequelizeValidationError') {
            res.status(400)
                .json({ message: err.errors[0].message });
        }
        else {
            console.log('err', err);

            res.status(500)
                .json({ message: err });
        } 
    }
}

module.exports = confirmPassword;

