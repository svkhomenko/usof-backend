const path = require("path");
const fs  = require("fs");
const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const { verifyJWTToken } = require('../../token/tokenTools');
const User = db.sequelize.models.user;
const Post = db.sequelize.models.post;
const Comment = db.sequelize.models.comment;
const ImageFromComment = db.sequelize.models.imageFromComment;
const { validateContent } = require('../tools/dataValidation');

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function createNewComment(req, res) {
    const token = req.headers.authorization;
    const { content, repliedCommentId } = req.body;
    const postId = req.params.post_id;
    
    try {
        const decoded = await verifyJWTToken(token, tokenOptions.secret);

        const curUser = await User.findByPk(decoded.id);
        if (!curUser) {
            throw new ValidationError("Invalid token", 401);
        }

        const curPost = await Post.findByPk(postId);
        if (!curPost) {
            throw new ValidationError("No post with this id", 404);
        }
        
        if (curPost.status === "inactive") {
            throw new ValidationError("Forbidden data", 403); 
        }

        validateContent(content);

        if (repliedCommentId) {
            const repliedComment = await Comment.findByPk(repliedCommentId);
            if (!repliedComment) {
                throw new ValidationError("No comment with this id", 404);
            }
            
            if (repliedComment.status === "inactive") {
                throw new ValidationError("Forbidden data", 403); 
            }
        }

        const comment = await Comment.create({
            content,
            author: curUser.id,
            postId: curPost.id,
            repliedCommentId
        });

        await Promise.all(req.files.map(async (file) => {
            if (file && file.filename) {
                await ImageFromComment.create({
                    picturePath: file.filename,
                    commentId: comment.id
                });
            }
        }));
        
        res.setHeader("Location", `/api/comments/${comment.id}`)
            .status(201).send();
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

module.exports = createNewComment;

