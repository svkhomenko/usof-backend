const path = require("path");
const fs  = require("fs");
const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const { verifyJWTToken } = require('../../token/tokenTools');
const User = db.sequelize.models.user;
const Post = db.sequelize.models.post;
const Comment = db.sequelize.models.comment;
const ImageFromComment = db.sequelize.models.imageFromComment;

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function getCommentById(req, res) {
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

        const curComment = await Comment.findOne({
            where: {
                id: commentId
            },
            include: [
                { 
                    model: ImageFromComment
                },
                {
                    model: User,
                    as: 'commentAuthor'
                },
                {
                    model: Comment,
                    as: 'repliedComment',
                    include: [
                        {
                            model: User,
                            as: 'commentAuthor'
                        }
                    ]
                }
            ],
        });
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

        let [ownlike] = await curComment.getLikeForComments({ where: { author: (curUser ? curUser.id : 0) } });

        let repliedComment = null;
        if (curComment.repliedComment) {
            repliedComment = 'Comment is inactive'
            if ((curUser && (curUser.role === 'admin' || curComment.repliedComment.author == curUser.id ))
                || curComment.repliedComment.status === 'active') {

                repliedComment = {
                    id: curComment.repliedComment.id,
                    publishDate: curComment.repliedComment.publishDate,
                    status: curComment.repliedComment.status,
                    content: curComment.repliedComment.content,
                    author: {
                        id: curComment.repliedComment.commentAuthor.id,
                        login: curComment.repliedComment.commentAuthor.login,
                        fullName: curComment.repliedComment.commentAuthor.fullName,
                        email: curComment.repliedComment.commentAuthor.email,
                        role: curComment.repliedComment.commentAuthor.role,
                        profilePicture: curComment.repliedComment.commentAuthor.profilePicture,
                        rating: await curComment.repliedComment.commentAuthor.getRating(),
                        status: curComment.repliedComment.commentAuthor.status
                    }
                };
            }
        }
        
        res.status(200)
            .json({
                id: curComment.id,
                publishDate: curComment.publishDate,
                status: curComment.status,
                content: curComment.content,
                author: {
                    id: curComment.commentAuthor.id,
                    login: curComment.commentAuthor.login,
                    fullName: curComment.commentAuthor.fullName,
                    email: curComment.commentAuthor.email,
                    role: curComment.commentAuthor.role,
                    profilePicture: curComment.commentAuthor.profilePicture,
                    rating: await curComment.commentAuthor.getRating(),
                    status: curComment.commentAuthor.status
                },
                images: curComment.imageFromComments.map(image => {
                    return ({
                        id: image.id,
                        image: image.image
                    });
                }),
                likesCount: await curComment.countLikeForComments( { where: { type: "like" } }),
                dislikesCount: await curComment.countLikeForComments( { where: { type: "dislike" } }),
                repliedComment: repliedComment,
                isLiked: (ownlike ? { type: ownlike.type } : false)
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

module.exports = getCommentById;

