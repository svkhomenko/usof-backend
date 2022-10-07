const express = require("express");
const postsController = require('../controllers/posts_controllers/posts_controller');
const isAuth = require("../middleware/isAuth");
const canUpdatePostData = require("../middleware/canUpdatePostData");
const postsRouter = express.Router();

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

function postImagesUpload(req, res, next) {
    const upload = fileUpload.array('postImages', 10);

    upload(req, res, function (err) {
        if (err) {
            console.log('err', err);
            return res.status(400)
                .json({ message: err });
        }
        next();
    });
}

postsRouter.get("/", postsController.getAllPosts);
postsRouter.get("/own-posts", isAuth, postsController.getOwnPosts);
postsRouter.get("/favorites", isAuth, postsController.getFavoritesPosts);
postsRouter.get("/:post_id", postsController.getPostById);
postsRouter.get("/:post_id/comments", postsController.getPostCommentsById);
postsRouter.post("/:post_id/comments", isAuth, commentImagesUpload, postsController.createNewComment);
postsRouter.get("/:post_id/categories", postsController.getPostCategoriesById);
postsRouter.get("/:post_id/like", postsController.getPostLikeById);
postsRouter.post("/", isAuth, postImagesUpload, postsController.createNewPost);
postsRouter.post("/:post_id/like", isAuth, postsController.createNewLikeUnderPost);
postsRouter.post("/:post_id/favorites", isAuth, postsController.updateFavoritesPosts);
postsRouter.patch("/:post_id", canUpdatePostData, postImagesUpload, postsController.uploadPostData);
postsRouter.delete("/:post_id", canUpdatePostData, postsController.deletePost);
postsRouter.delete("/:post_id/like", isAuth, postsController.deleteLikeUnderPost);

module.exports = postsRouter;

