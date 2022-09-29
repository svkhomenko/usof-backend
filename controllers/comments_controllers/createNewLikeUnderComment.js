const path = require("path");
const fs  = require("fs");
const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const { verifyJWTToken } = require('../../token/tokenTools');
const User = db.sequelize.models.user;
const Post = db.sequelize.models.post;
const Comment = db.sequelize.models.comment;
const LikeForComment = db.sequelize.models.likeForComment;

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function createNewLikeUnderComment(req, res) {
    const token = req.headers.authorization;
    const { type } = req.body;
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

        const curPost = await Post.findByPk(curComment.postId);
        if (!curPost) {
            throw new ValidationError("No post with this id", 404);
        }
        if (curUser.role !== 'admin' && curComment.author != curUser.id
            && (curPost.status === "inactive" || curComment.status === "inactive")) {
            throw new ValidationError("Forbidden data", 403); 
        }

        if (!type) {
            throw new ValidationError("Type is required", 400);
        }
        if (type !== 'like' && type !== 'dislike') {
            throw new ValidationError("Type must be 'like' or 'dislike'", 400);
        }
        
        await LikeForComment.destroy({
            where: {
                author: curUser.id,
                commentId: curComment.id
            }
        });
        
        await LikeForComment.create({
            author: curUser.id,
            commentId: curComment.id,
            type
        });        
        
        res.status(201).send();
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

module.exports = createNewLikeUnderComment;

