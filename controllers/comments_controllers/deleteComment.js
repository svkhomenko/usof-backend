const db = require("../../models/init.js");
const Comment = db.sequelize.models.comment;

async function deleteComment(req, res) {
    const commentId = req.params.comment_id;

    try {
        await Comment.destroy({
            where: {
                id: commentId
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

module.exports = deleteComment;

