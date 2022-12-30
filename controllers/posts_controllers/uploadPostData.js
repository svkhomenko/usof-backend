const path = require("path");
const fs  = require("fs");
const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const { verifyJWTToken } = require('../../token/tokenTools');
const User = db.sequelize.models.user;
const Post = db.sequelize.models.post;
const ImageFromPost = db.sequelize.models.imageFromPost;
const Category = db.sequelize.models.category;
const CategoryPost = db.sequelize.models.categoryPost;
const { validateTitle, validateContent } = require('../tools/dataValidation');

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function uploadPostData(req, res) {
    const token = req.headers.authorization;
    const postId = req.params.post_id;
    let { title, content, categories, status, deleteFiles, deleteAllCategories } = req.body;
    
    try {
        const decoded = await verifyJWTToken(token, tokenOptions.secret);

        const curUser = await User.findByPk(decoded.id);
        if (!curUser) {
            throw new ValidationError("Invalid token", 401);
        }

        let post = await Post.findByPk(postId);
        if (!post) {
            throw new ValidationError("No post with this id", 404);
        }

        if (curUser.role !== 'admin' && post.status === "inactive") {
            throw new ValidationError("Forbidden data", 403); 
        }

        if (categories) {
            if (!Array.isArray(categories)) {
                throw new ValidationError("Categories must be array", 400);
            }

            for (let i = 0; i < categories.length; i++) {
                const category = await Category.findByPk(categories[i]);
                if (!category) {
                    throw new ValidationError("No category with this id", 400);
                }
            }
        }
        
        if (status && curUser.role === 'admin') {
            if (status !== 'active' && status !== 'inactive') {
                throw new ValidationError("Status must be 'active' or 'inactive'", 400);
            }

            post.set({
                status
            });
        }

        if (post.author == curUser.id) {
            if (title) {
                validateTitle(title);
                post.set({
                    title
                });
            }
    
            if (content) {
                validateContent(content);
                post.set({
                    content
                });
            }

            if (deleteFiles) {
                if (!Array.isArray(deleteFiles)) {
                    throw new ValidationError("deleteFiles must be array", 400);
                }

                await Promise.all(deleteFiles.map(async (fileId) => {
                    await ImageFromPost.destroy({
                        where: {
                            id: fileId,
                            postId: post.id
                        }
                    });
                }));
            }
    
            let { count } = await ImageFromPost.findAndCountAll({
                where: {
                    postId: post.id
                }
            });
    
            if (req.files && req.files.length + count > 10) {
                throw new ValidationError("Number of files is exceeded. Maximum number of files is 10", 400);
            }
    
            if (req.files) {
                await Promise.all(req.files.map(async (file) => {
                    if (file && file.filename) {
                        await ImageFromPost.create({
                            picturePath: file.filename,
                            postId: post.id
                        });
                    }
                }));
            }
        }

        post = await post.save();

        if (categories) {
            await CategoryPost.destroy({
                where: {
                    postId: post.id
                }
            });

            await Promise.all(categories.map(async (categoryId) => {
                await CategoryPost.create({
                    categoryId: categoryId,
                    postId: post.id
                });
            }));
        }
        else if (deleteAllCategories) {
            await CategoryPost.destroy({
                where: {
                    postId: post.id
                }
            });
        }
        
        post = await Post.findOne({
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

        let [ownlike] = await post.getLikeForPosts({ where: { author: curUser.id } });
        
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

module.exports = uploadPostData;

