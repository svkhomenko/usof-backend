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

async function getCommentLikeById(req, res) {
    const token = req.headers.authorization;
    const commentId = req.params.comment_id;
    
    try {
        let decoded;
        let curUser;
        
        try {
            decoded = await verifyJWTToken(token, tokenOptions.secret);
        }
        catch (err) {}

        if (decoded && decoded.id) {
            curUser = await User.findByPk(decoded.id);
        }
        
        const curComment = await Comment.findByPk(commentId);
        if (!curComment) {
            throw new ValidationError("No comment with this id", 404);
        }

        const curPost = await Post.findByPk(curComment.postId);
        if (!curPost) {
            throw new ValidationError("No post with this id", 404);
        }
        if ((!curUser || (curUser && curUser.role !== 'admin' && curComment.author != curUser.id))
            && (curPost.status === "inactive" || curComment.status === "inactive")) {
            throw new ValidationError("Forbidden data", 403); 
        }

        let limit = 50;
        let offset = 0;
        if (req.query.page) {
            if (req.query.page < 1) {
                throw new ValidationError("No such page", 400);
            }
            offset = (req.query.page - 1) * limit;
        }

        let {count: countLikes, rows: likes} = await LikeForComment.findAndCountAll({
            where: {
                commentId: commentId,
                type: 'like'
            },
            include: [
                {
                    model: User
                }
            ],
            offset: offset,
            limit: limit
        });

        let {count: countDislikes, rows: dislikes} = await LikeForComment.findAndCountAll({
            where: {
                commentId: commentId,
                type: 'dislike'
            },
            include: [
                {
                    model: User
                }
            ],
            offset: offset,
            limit: limit
        });

        likes = await Promise.all(likes.map(async (like) => {
            return ({
                author: {
                    id: like.user.id,
                    login: like.user.login,
                    fullName: like.user.fullName,
                    email: like.user.email,
                    role: like.user.role,
                    profilePicture: like.user.profilePicture,
                    rating: await like.user.getRating(),
                    status: like.user.status
                },
                commentId: like.commentId,
                publishDate: like.publishDate,
                type: like.type
            });
        }));

        dislikes = await Promise.all(dislikes.map(async (dislike) => {
            return ({
                author: {
                    id: dislike.user.id,
                    login: dislike.user.login,
                    fullName: dislike.user.fullName,
                    email: dislike.user.email,
                    role: dislike.user.role,
                    profilePicture: dislike.user.profilePicture,
                    rating: await dislike.user.getRating(),
                    status: dislike.user.status
                },
                commentId: dislike.commentId,
                publishDate: dislike.publishDate,
                type: dislike.type
            });
        }));

        res.status(200)
            .json({
                limit,
                countLikes,
                likes,
                countDislikes,
                dislikes
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

module.exports = getCommentLikeById;

