const getAllPosts = require('./getAllPosts');
const getOwnPosts = require('./getOwnPosts');
const getFavoritesPosts = require('./getFavoritesPosts');
const getPostById = require('./getPostById');
const getPostCommentsById = require('./getPostCommentsById');
const createNewComment = require('./createNewComment');
const getPostCategoriesById = require('./getPostCategoriesById');
const getPostLikeById = require('./getPostLikeById');
const createNewPost = require('./createNewPost');
const createNewLikeUnderPost = require('./createNewLikeUnderPost');
const updateFavoritesPosts = require('./updateFavoritesPosts');
const uploadPostData = require('./uploadPostData');
const deletePost = require('./deletePost');
const deleteLikeUnderPost = require('./deleteLikeUnderPost');

module.exports = {
    getAllPosts,
    getOwnPosts,
    getFavoritesPosts,
    getPostById,
    getPostCommentsById,
    createNewComment,
    getPostCategoriesById,
    getPostLikeById,
    createNewPost,
    createNewLikeUnderPost,
    updateFavoritesPosts,
    uploadPostData,
    deletePost,
    deleteLikeUnderPost
};

