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

async function deleteLikeUnderPost(req, res) {
    const token = req.headers.authorization;
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
        
        await LikeForPost.destroy({
            where: {
                author: curUser.id,
                postId: curPost.id
            }
        });

        res.status(204).send();
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

module.exports = deleteLikeUnderPost;

