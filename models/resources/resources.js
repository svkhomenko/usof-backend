const db = require("../init.js");
const userOptions = require('./userOptions');
const postOptions = require('./postOptions');
const favoritesPostOptions = require('./favoritesPostOptions');
const imageFromPostOptions = require('./imageFromPostOptions');
const categoryPostOptions = require('./categoryPostOptions');
const commentOptions = require('./commentOptions');
const imageFromCommentOptions = require('./imageFromCommentOptions');
const likeForPostOptions = require('./likeForPostOptions');
const likeForCommentOptions = require('./likeForCommentOptions');

const User = db.sequelize.models.user; 
const Post = db.sequelize.models.post; 
const FavoritesPost = db.sequelize.models.favoritesPost;
const ImageFromPost = db.sequelize.models.imageFromPost;
const Category = db.sequelize.models.category; 
const CategoryPost = db.sequelize.models.categoryPost; 
const Comment = db.sequelize.models.comment; 
const ImageFromComment = db.sequelize.models.imageFromComment;
const LikeForPost = db.sequelize.models.likeForPost;
const LikeForComment = db.sequelize.models.likeForComment; 

module.exports = [
    {
        resource: User,
        options: userOptions.options,
        features: userOptions.features
    },
    {
        resource: Post,
        options: postOptions.options
    },
    {
        resource: FavoritesPost,
        options: favoritesPostOptions.options
    },
    {
        resource: ImageFromPost,
        options: imageFromPostOptions.options,
        features: imageFromPostOptions.features
    },
    {
        resource: Category,
        options: {
            listProperties: ['id', 'title', 'description']
        }
    },
    {
        resource: CategoryPost,
        options: categoryPostOptions.options 
    },
    {
        resource: Comment,
        options: commentOptions.options 
    },
    {
        resource: ImageFromComment,
        options: imageFromCommentOptions.options,
        features: imageFromCommentOptions.features
    },
    {
        resource: LikeForPost,
        options: likeForPostOptions.options 
    },
    {
        resource: LikeForComment,
        options: likeForCommentOptions.options
    }
];

