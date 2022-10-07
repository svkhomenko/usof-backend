const path = require("path");
const fs  = require("fs");
const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const { verifyJWTToken } = require('../../token/tokenTools');
const User = db.sequelize.models.user;
const Post = db.sequelize.models.post;
const LikeForPost = db.sequelize.models.likeForPost;

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function getPostLikeById(req, res) {
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

        const curPost = await Post.findByPk(postId);
        if (!curPost) {
            throw new ValidationError("No post with this id", 404);
        }

        if ((!curUser || (curUser && curUser.role !== 'admin')) && curPost.status === "inactive") {
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

        let {count: countLikes, rows: likes} = await LikeForPost.findAndCountAll({
            where: {
                postId: postId,
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

        let {count: countDislikes, rows: dislikes} = await LikeForPost.findAndCountAll({
            where: {
                postId: postId,
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
                postId: like.postId,
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
                postId: dislike.postId,
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

module.exports = getPostLikeById;

