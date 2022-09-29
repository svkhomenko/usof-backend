const path = require("path");
const fs  = require("fs");
const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const { verifyJWTToken } = require('../../token/tokenTools');
const User = db.sequelize.models.user;
const Post = db.sequelize.models.post;
const ImageFromPost = db.sequelize.models.imageFromPost;
const Category = db.sequelize.models.category;

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function getPostById(req, res) {
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
        
        const post = await Post.findOne({
            where: {
                id: postId
            },
            include: [
                { 
                    model: ImageFromPost
                },
                {
                    model: User,
                    as: 'postAuthor'
                },
                {
                    model: User,
                    as: "addToFavoritesUser",
                    where: {
                        id: (curUser ? curUser.id : 0)
                    },
                    required: false
                },
                {
                    model: Category
                }
            ]
        });

        if (!post) {
            throw new ValidationError("No post with this id", 404);
        }

        if ((!curUser || curUser.role !== 'admin') && post.status === "inactive") {
            throw new ValidationError("Forbidden data", 403); 
        }

        let [ownlike] = await post.getLikeForPosts({ where: { author: (curUser ? curUser.id : 0) } });
        
        res.status(200)
            .json({
                id: post.id,
                title: post.title,
                publishDate: post.publishDate,
                status: post.status,
                content: post.content,
                author: {
                    id: post.postAuthor.id,
                    login: post.postAuthor.login,
                    fullName: post.postAuthor.fullName,
                    email: post.postAuthor.email,
                    role: post.postAuthor.role,
                    profilePicture: post.postAuthor.profilePicture,
                    rating: await post.postAuthor.getRating(),
                    status: post.postAuthor.status
                },
                images: post.imageFromPosts.map(image => {
                    return ({
                        id: image.id,
                        image: image.image
                    });
                }),
                addToFavoritesUser: !!post.addToFavoritesUser.length,
                isLiked: (ownlike ? { type: ownlike.type } : false),
                categories: post.categories.map(category => {
                    return ({
                        id: category.id,
                        title: category.title,
                        description: category.description
                    });
                }),
                likesCount: await post.countLikeForPosts( { where: { type: "like" } }),
                dislikesCount: await post.countLikeForPosts( { where: { type: "dislike" } })
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

module.exports = getPostById;

