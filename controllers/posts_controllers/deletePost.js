const db = require("../../models/init.js");
const Post = db.sequelize.models.post;

async function deletePost(req, res) {
    const postId = req.params.post_id;

    try {
        await Post.destroy({
            where: {
                id: postId
            }
        });
        
        res.status(204).send();
    }
    catch(err) {
        if (err.name == 'SequelizeValidationError') {
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

module.exports = deletePost;

