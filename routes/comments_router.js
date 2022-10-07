const express = require("express");
const commentsController = require('../controllers/comments_controllers/comments_controller');
const isAuth = require("../middleware/isAuth");
const canUpdateCommentData = require("../middleware/canUpdateCommentData");
const commentsRouter = express.Router();

const fileUpload = require('../middleware/fileUpload');

function commentImagesUpload(req, res, next) {
    const upload = fileUpload.array('commentImages', 10);

    upload(req, res, function (err) {
        if (err) {
            return res.status(400)
                .json({ message: err });
        }
        next();
    });
}

commentsRouter.get("/:comment_id", commentsController.getCommentById);
commentsRouter.get("/:comment_id/like", commentsController.getCommentLikeById);
commentsRouter.post("/:comment_id/like", isAuth, commentsController.createNewLikeUnderComment);
commentsRouter.patch("/:comment_id", canUpdateCommentData, commentImagesUpload, commentsController.uploadCommentData);
commentsRouter.delete("/:comment_id", canUpdateCommentData, commentsController.deleteComment);
commentsRouter.delete("/:comment_id/like", isAuth, commentsController.deleteLikeUnderComment);

module.exports = commentsRouter;

