const path = require("path");
const fs  = require("fs");
const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const { verifyJWTToken } = require('../../token/tokenTools');
const User = db.sequelize.models.user;
const Post = db.sequelize.models.post;
const Category = db.sequelize.models.category;

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function getPostCategoriesById(req, res) {
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
        
        const post = await Post.findByPk(postId);
        if (!post) {
            throw new ValidationError("No post with this id", 404);
        }

        if ((!curUser || curUser.role !== 'admin') && post.status === "inactive") {
            throw new ValidationError("Forbidden data", 403); 
        }
        
        let categories = await Category.findAll({
            include: [
                { 
                    model: Post,
                    where: {
                        id: postId
                    },
                    attributes: []
                }
            ]
        });

        categories = categories.map(category => {
            return ({
                id: category.id,
                title: category.title,
                description: category.description
            });
        });
        
        res.status(200)
            .json({
                categories
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

module.exports = getPostCategoriesById;

