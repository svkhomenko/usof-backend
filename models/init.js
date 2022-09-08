const path = require("path");
const fs = require("fs");
const { Sequelize } = require("sequelize");
const mysql = require('mysql2/promise');

const initUser = require("./user");
const initPost = require("./post");
const initImageFromPost = require("./imageFromPost");
const initCategory = require("./category");
const initComment = require("./comment");
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
initComment(sequelize);
initLikeForPost(sequelize);
initLikeForComment(sequelize);

const User = sequelize.models.user;
const Post = sequelize.models.post;
const ImageFromPost = sequelize.models.imageFromPost;
const Category = sequelize.models.category;
const Comment = sequelize.models.comment;
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
User.hasMany(Post, UserPostSettings);
Post.belongsTo(User, UserPostSettings);

const PostImageSettings = {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
};
Post.hasMany(ImageFromPost, PostImageSettings);
ImageFromPost.belongsTo(Post, PostImageSettings);

Category.belongsToMany(Post, { through: "CategoryPost" });
Post.belongsToMany(Category, { through: "CategoryPost" });

const UserCommentSettings = {
    foreignKey: {
        name: 'author',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
};
User.hasMany(Comment, UserCommentSettings);
Comment.belongsTo(User, UserCommentSettings);

const PostCommentSettings = {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
};
Post.hasMany(Comment, PostCommentSettings);
Comment.belongsTo(Post, PostCommentSettings);

User.belongsToMany(Post, { 
    through: LikeForPost,
    foreignKey: "author"
});
Post.belongsToMany(User, { through: LikeForPost});

User.belongsToMany(Comment, { 
    through: LikeForComment,
    foreignKey: "author"
});
Comment.belongsToMany(User, { through: LikeForComment});

// sequelize.sync({ force: true });
sequelize.sync({ alter: true });
// sequelize.sync();

// User.create({
//     login: 'aasa',
//     password: 'dfsdg',
//     fullName: 'sfdsgtg',
//     email: 'difgssdio@gmail.com',
//     profilePicture: fs.readFileSync(path.resolve("uploads", '1.png'))
// });

const db = {
    sequelize: sequelize,
    options: dbOptions
};

module.exports = db;