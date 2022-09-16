const path = require("path");
const fs = require("fs");
const { Sequelize } = require("sequelize");
const mysql = require('mysql2/promise');

const initUser = require("./user");
const initPost = require("./post");
const initImageFromPost = require("./imageFromPost");
const initCategory = require("./category");
const initCategoryPost = require("./categoryPost");
const initComment = require("./comment");
const initImageFromComment = require("./imageFromComment");
const initLikeForPost = require("./likeForPost");
const initLikeForComment = require("./likeForComment");

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
initImageFromPost(sequelize);
initCategory(sequelize);
initCategoryPost(sequelize);
initComment(sequelize);
initImageFromComment(sequelize);
initLikeForPost(sequelize);
initLikeForComment(sequelize);

const User = sequelize.models.user;
const Post = sequelize.models.post;
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
    onUpdate: 'CASCADE'
};
User.hasMany(Post, { as: 'ownPosts', ...UserPostSettings});
Post.belongsTo(User, {  as: 'postAuthor', ...UserPostSettings});

const PostImageSettings = {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
};
Post.hasMany(ImageFromPost, PostImageSettings);
ImageFromPost.belongsTo(Post, PostImageSettings);

const CommentImageSettings = {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
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
    onUpdate: 'CASCADE'
};
User.hasMany(Comment, { as: 'ownComments', ...UserCommentSettings});
Comment.belongsTo(User, {  as: 'commentAuthor', ...UserCommentSettings});

const PostCommentSettings = {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
};
Post.hasMany(Comment, PostCommentSettings);
Comment.belongsTo(Post, PostCommentSettings);

const CommentCommentSettings = {
    foreignKey: {
        name: 'repliedCommentId'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
};
Comment.hasMany(Comment, { as: 'replies', ...CommentCommentSettings});
Comment.belongsTo(Comment, {  as: 'repliedComment', ...CommentCommentSettings});

User.belongsToMany(Post, { 
    as: 'ownPostLikes',
    through: LikeForPost,
    foreignKey: "author"
});
Post.belongsToMany(User, { 
    as: 'postLikeAuthor', 
    through: LikeForPost
});

User.belongsToMany(Comment, { 
    as: 'ownCommentLikes',
    through: LikeForComment,
    foreignKey: "author"
});
Comment.belongsToMany(User, { 
    as: 'commentLikeAuthor', 
    through: LikeForComment
});

// sequelize.sync({ force: true })
// .then(() => {
//     const bcrypt  = require("bcrypt");
//     let salt = bcrypt.genSaltSync(10);

//     User.create({
//         login: 'aasa',
//         encryptedPassword: bcrypt.hashSync('user1Q', salt),
//         fullName: 'sfdsgtg',
//         email: 'qqq@gmail.com',
//         role: 'admin',
//         status: 'active',
//         // profilePicture: fs.readFileSync(path.resolve("uploads", '1.png'))
//     });
// });
// sequelize.sync({ alter: true });
sequelize.sync();


// User.create({
//     login: 'notAdmin',
//     encryptedPassword: bcrypt.hashSync('usxcvvcer1Q', salt),
//     fullName: 'sfddfsgtg',
//     email: 'qdsfqq@gmail.com',
//     role: 'user'
//     // profilePicture: fs.readFileSync(path.resolve("uploads", '1.png'))
// });
    
// ImageFromPost.create({
//     picturePath: '151663171830063-posts-logo.png',
//     postId: 2
// });

// (async () => {
//     const user = await User.findOne({
//         where: {
//             id: 1
//         },
//         // include: {
//         //     model: Post,
//         //     as: 'ownPosts'
//         // }
//     });
//     console.log(user);
// })();

// (async () => {
//     const comment = await Comment.findAll({
//         include: [
//             {
//                 model: Post
//             },
//             {
//                 model: Comment,
//                 as: 'replies'
//             },
//             {
//                 model: Comment,
//                 as: 'repliedComment'
//             }
//         ]
//     });
//     console.log(comment);
// })();

const db = {
    sequelize: sequelize,
    options: dbOptions
};

module.exports = db;