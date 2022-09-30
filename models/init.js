const path = require("path");
const fs = require("fs");
const { Sequelize } = require("sequelize");
const mysql = require('mysql2/promise');

const initUser = require("./user");
const initPost = require("./post");
const initFavoritesPost = require("./favoritesPost");
const initImageFromPost = require("./imageFromPost");
const initCategory = require("./category");
const initCategoryPost = require("./categoryPost");
const initComment = require("./comment");
const initImageFromComment = require("./imageFromComment");
const initLikeForPost = require("./likeForPost");
const initLikeForComment = require("./likeForComment");
const initToken = require('./token');

const dbFilePath = path.resolve("configs", "db-config.json");
const dbOptFile = fs.readFileSync(dbFilePath);
const dbOptions = JSON.parse(dbOptFile);

(async () => {
    const { host, port, user, password, database } = dbOptions;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
})();

const sequelize = new Sequelize( 
    dbOptions.database,
    dbOptions.user,
    dbOptions.password,
    {
        dialect: dbOptions.dialect,
        logging: false
    },
);

initUser(sequelize);
initPost(sequelize);
initFavoritesPost(sequelize);
initImageFromPost(sequelize);
initCategory(sequelize);
initCategoryPost(sequelize);
initComment(sequelize);
initImageFromComment(sequelize);
initLikeForPost(sequelize);
initLikeForComment(sequelize);
initToken(sequelize);

const User = sequelize.models.user;
const Post = sequelize.models.post;
const FavoritesPost = sequelize.models.favoritesPost;
const ImageFromPost = sequelize.models.imageFromPost;
const Category = sequelize.models.category;
const CategoryPost = sequelize.models.categoryPost;
const Comment = sequelize.models.comment;
const ImageFromComment = sequelize.models.imageFromComment;
const LikeForPost = sequelize.models.likeForPost;
const LikeForComment = sequelize.models.likeForComment;

const UserPostSettings = {
    foreignKey: {
        name: 'author',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true
};
User.hasMany(Post, { as: 'ownPosts', ...UserPostSettings});
Post.belongsTo(User, {  as: 'postAuthor', ...UserPostSettings});

User.belongsToMany(Post, { 
    as: 'ownFavoritesPost',
    through: FavoritesPost,
    hooks: true
});
Post.belongsToMany(User, { 
    as: 'addToFavoritesUser', 
    through: FavoritesPost,
    hooks: true
});

const PostImageSettings = {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true
};
Post.hasMany(ImageFromPost, PostImageSettings);
ImageFromPost.belongsTo(Post, PostImageSettings);

const CommentImageSettings = {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true
};
Comment.hasMany(ImageFromComment, CommentImageSettings);
ImageFromComment.belongsTo(Comment, CommentImageSettings);

Category.belongsToMany(Post, { through: CategoryPost });
Post.belongsToMany(Category, { through: CategoryPost });

const UserCommentSettings = {
    foreignKey: {
        name: 'author',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true
};
User.hasMany(Comment, { as: 'ownComments', ...UserCommentSettings});
Comment.belongsTo(User, {  as: 'commentAuthor', ...UserCommentSettings});

const PostCommentSettings = {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true
};
Post.hasMany(Comment, PostCommentSettings);
Comment.belongsTo(Post, PostCommentSettings);

const CommentCommentSettings = {
    foreignKey: {
        name: 'repliedCommentId'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true
};
Comment.hasMany(Comment, { as: 'replies', ...CommentCommentSettings});
Comment.belongsTo(Comment, {  as: 'repliedComment', ...CommentCommentSettings});

const UserLikeSettings = {
    foreignKey: {
        name: 'author',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true
};
User.belongsToMany(Post, { 
    as: 'ownPostLikes',
    through: LikeForPost,
    foreignKey: "author",
    hooks: true
});
Post.belongsToMany(User, { 
    as: 'postLikeAuthor', 
    through: LikeForPost,
    hooks: true
});
User.hasMany(LikeForPost, UserLikeSettings);
LikeForPost.belongsTo(User, UserLikeSettings);
Post.hasMany(LikeForPost);
LikeForPost.belongsTo(Post);

User.belongsToMany(Comment, { 
    as: 'ownCommentLikes',
    through: LikeForComment,
    foreignKey: "author",
    hooks: true
});
Comment.belongsToMany(User, { 
    as: 'commentLikeAuthor', 
    through: LikeForComment,
    hooks: true
});
User.hasMany(LikeForComment, UserLikeSettings);
LikeForComment.belongsTo(User, UserLikeSettings);
Comment.hasMany(LikeForComment);
LikeForComment.belongsTo(Comment);

User.prototype.getRating = async function() {
    const postLikes = await LikeForPost.findAndCountAll({
        where: {
            type: "like"
        },
        include: [
            { 
                model: Post, 
                where: { 
                    author: this.id,
                    status: "active"
                } 
            }
        ]
    });
    
    const postDislikes = await LikeForPost.findAndCountAll({
        where: {
            type: "dislike"
        },
        include: [
            { 
                model: Post, 
                where: { 
                    author: this.id,
                    status: "active"
                } 
            }
        ]
    });

    const commentLikes = await LikeForComment.findAndCountAll({
        where: {
            type: "like"
        },
        include: [
            { 
                model: Comment, 
                where: { 
                    author: this.id,
                    status: "active"
                } 
            }
        ]
    });
    
    const commentDislikes = await LikeForComment.findAndCountAll({
        where: {
            type: "dislike"
        },
        include: [
            { 
                model: Comment, 
                where: { 
                    author: this.id,
                    status: "active"
                } 
            }
        ]
    });

    return postLikes.count + commentLikes.count - postDislikes.count - commentDislikes.count;
};

// Recreating the database and filling it with test data

sequelize.sync({ force: true })
.then(() => {
    require('./createTestData')(sequelize);
});

// Uncomment this and comment out the sync above if you don't want to recreate the database
// sequelize.sync();

const db = {
    sequelize: sequelize,
    options: dbOptions
};

module.exports = db;

