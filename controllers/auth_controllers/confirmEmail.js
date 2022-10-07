const path = require("path");
const fs  = require("fs");

const { verifyJWTToken, destroyJWTToken } = require('../../token/tokenTools');

const db = require("../../models/init.js");
const User = db.sequelize.models.user;

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function confirmEmail(req, res) {
    const confirmToken = req.params.confirm_token;

    try {
        const decoded = await verifyJWTToken(confirmToken, tokenOptions.secret_email);
        if (!decoded.email) {
            throw new Error('');
        }

        let user = await User.findOne({
            where: {
                email: decoded.email
            },
        });
        if (!user) {
            throw new Error('');
        }
        
        user.set({
            status: "active"
        });
        user = await user.save();

        await destroyJWTToken(confirmToken);
        
        res.setHeader("Location", `/api/users/${user.id}`)
            .status(201).send();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = confirmEmail;

