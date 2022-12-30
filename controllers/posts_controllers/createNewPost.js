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

async function createNewPost(req, res) {
    const token = req.headers.authorization;
    const { title, content, categories } = req.body;

    try {
        const decoded = await verifyJWTToken(token, tokenOptions.secret);

        const curUser = await User.findByPk(decoded.id);
        if (!curUser) {
            throw new ValidationError("Invalid token", 401);
        }

        validateTitle(title);
        validateContent(content);

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
        
        const post = await Post.create({
            title,
            content,
            author: curUser.id
        });

        await Promise.all(req.files.map(async (file) => {
            if (file && file.filename) {
                await ImageFromPost.create({
                    picturePath: file.filename,
                    postId: post.id
                });
            }
        }));

        if (categories) {
            await Promise.all(categories.map(async (categoryId) => {
                await CategoryPost.create({
                    categoryId: categoryId,
                    postId: post.id
                });
            }));
        }

        res.setHeader("Location", `/api/posts/${post.id}`)
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

module.exports = createNewPost;

