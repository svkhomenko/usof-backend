const path = require("path");
const fs  = require("fs");
const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const { verifyJWTToken } = require('../../token/tokenTools');
const User = db.sequelize.models.user;

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function uploadAvatar(req, res) {
    const token = req.headers.authorization;
    
    try {
        const decoded = await verifyJWTToken(token, tokenOptions.secret);

        let curUser = await User.findByPk(decoded.id);
        if (!curUser) {
            throw new ValidationError("Invalid token", 401);
        }

        if (req.file && req.file.filename) {
            curUser.set({
                picturePath: req.file.filename
            });
            curUser = await curUser.save();
        }
        else if (req.body.deleteAvatar) {
            curUser.set({
                picturePath: null
            });
            curUser = await curUser.save();
        }

        res.status(200)
            .json({
                id: curUser.id,
                login: curUser.login,
                fullName: curUser.fullName,
                email: curUser.email,
                role: curUser.role,
                profilePicture: curUser.profilePicture,
                rating: await curUser.getRating(),
                status: curUser.status
            });
    }
    catch(err) {
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

module.exports = uploadAvatar;

