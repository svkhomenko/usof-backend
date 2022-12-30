const { Op } = require("sequelize");
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

async function getPostCommentsById(req, res) {
    const token = req.headers.authorization;
    const postId = req.params.post_id;
    
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

        let post = await Post.findByPk(postId);
        if (!post) {
            throw new ValidationError("No post with this id", 404);
        }
        
        if ((!curUser || curUser.role !== 'admin') && post.status === "inactive") {
            throw new ValidationError("Forbidden data", 403); 
        }

        let limit = 10;
        
        let where = {};
        if (!(curUser && curUser.role === 'admin')) {
            where = {
                status: 'active'
            }
        }

        if (req.query.lastDate) {
            let valid = (new Date(req.query.lastDate)).getTime() > 0;
            if (!valid) {
                throw new ValidationError("lastDate is invalid", 400);
            }
            
            where = {
                ...where,
                publishDate: {
                    [Op.gt]: req.query.lastDate
                }
            };
        }
        else if (req.query.numberOfPosts) {
            let numberOfPosts = +req.query.numberOfPosts;
            if (isNaN(numberOfPosts)) {
                throw new ValidationError("numberOfPosts is invalid", 400);
            }
            if (numberOfPosts > limit) {
                limit = numberOfPosts;
            } 
        }
        
        let {count: countComments, rows: allComments} = await Comment.findAndCountAll({
            where: {
                postId: postId,
                ...where
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
            order: [['publishDate', 'ASC']],
            limit: limit
        });

        allComments = await Promise.all(allComments.map(async (comment) => {
            let [ownlike] = await comment.getLikeForComments({ where: { author: (curUser ? curUser.id : 0) } });

            let repliedComment = null;
            if (comment.repliedComment) {
                repliedComment = 'Comment is inactive'
                if ((curUser && (curUser.role === 'admin' || comment.repliedComment.author == curUser.id)) 
                    || comment.repliedComment.status === 'active') {
                        
                    repliedComment = {
                        id: comment.repliedComment.id,
                        publishDate: comment.repliedComment.publishDate,
                        status: comment.repliedComment.status,
                        content: comment.repliedComment.content,
                        author: {
                            id: comment.repliedComment.commentAuthor.id,
                            login: comment.repliedComment.commentAuthor.login,
                            fullName: comment.repliedComment.commentAuthor.fullName,
                            email: comment.repliedComment.commentAuthor.email,
                            role: comment.repliedComment.commentAuthor.role,
                            profilePicture: comment.repliedComment.commentAuthor.profilePicture,
                            rating: await comment.repliedComment.commentAuthor.getRating(),
                            status: comment.repliedComment.commentAuthor.status
                        }
                    };
                }
            }
            
            return ({
                id: comment.id,
                publishDate: comment.publishDate,
                status: comment.status,
                content: comment.content,
                author: {
                    id: comment.commentAuthor.id,
                    login: comment.commentAuthor.login,
                    fullName: comment.commentAuthor.fullName,
                    email: comment.commentAuthor.email,
                    role: comment.commentAuthor.role,
                    profilePicture: comment.commentAuthor.profilePicture,
                    rating: await comment.commentAuthor.getRating(),
                    status: comment.commentAuthor.status
                },
                images: comment.imageFromComments.map(image => {
                    return ({
                        id: image.id,
                        image: image.image
                    });
                }),
                likesCount: await comment.countLikeForComments( { where: { type: "like" } }),
                dislikesCount: await comment.countLikeForComments( { where: { type: "dislike" } }),
                repliedComment: repliedComment,
                isLiked: (ownlike ? { type: ownlike.type } : false)
            });
        }));
        
        res.status(200)
            .json({
                limit,
                countComments: countComments,
                allComments
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

module.exports = getPostCommentsById;

