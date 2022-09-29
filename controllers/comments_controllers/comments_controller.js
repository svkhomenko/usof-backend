const getCommentById = require('./getCommentById');
const getCommentLikeById = require('./getCommentLikeById');
const createNewLikeUnderComment = require('./createNewLikeUnderComment');
const uploadCommentData = require('./uploadCommentData');
const deleteComment = require('./deleteComment');
const deleteLikeUnderComment = require('./deleteLikeUnderComment');

module.exports = {
    getCommentById,
    getCommentLikeById,
    createNewLikeUnderComment,
    uploadCommentData,
    deleteComment,
    deleteLikeUnderComment
};

