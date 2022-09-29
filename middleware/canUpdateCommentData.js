const path = require("path");
const fs  = require("fs");
const db = require("../models/init.js");
const User = db.sequelize.models.user;
const Comment = db.sequelize.models.comment;
const { verifyJWTToken } = require('../token/tokenTools');
const ValidationError = require('../errors/ValidationError');

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function canUpdateCommentData(req, res, next) {
    const token = req.headers.authorization;
    const commentId = req.params.comment_id;

    try {
        const decoded = await verifyJWTToken(token, tokenOptions.secret);

        const curUser = await User.findByPk(decoded.id);
        if (!curUser) {
            throw new ValidationError("Invalid token", 401);
        }

        const curComment = await Comment.findByPk(commentId);
        if (!curComment) {
            throw new ValidationError("No comment with this id", 404);
        }

        if (curUser.role !== 'admin' && curComment.author != curUser.id) {
            throw new ValidationError("Forbidden data", 403); 
        }
        
        next();
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

module.exports = canUpdateCommentData;

