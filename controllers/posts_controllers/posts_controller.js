const getAllPosts = require('./getAllPosts');
const getPostById = require('./getPostById');
const getPostCommentsById = require('./getPostCommentsById');
const createNewComment = require('./createNewComment');
const getPostCategoriesById = require('./getPostCategoriesById');
const getPostLikeById = require('./getPostLikeById');
const createNewPost = require('./createNewPost');
// const uploadUserData = require('./uploadUserData');
// const deleteUser = require('./deleteUser');
// const uploadUserData = require('./uploadUserData');
// const deleteUser = require('./deleteUser');
// const uploadUserData = require('./uploadUserData');
// const deleteUser = require('./deleteUser');

module.exports = {
    getAllPosts,
    getPostById,
    getPostCommentsById,
    createNewComment,
    getPostCategoriesById,
    getPostLikeById,
    createNewPost
};

