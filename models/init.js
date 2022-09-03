const path = require("path");
const fs = require("fs");
const { Sequelize } = require("sequelize");
const mysql = require('mysql2/promise');

const initUser = require("./user");
const initPost = require("./post");
const initImageFromPost = require("./imageFromPost");
const initCategory = require("./category");

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
        // logging: false
    },
);

initUser(sequelize);
initPost(sequelize);
initImageFromPost(sequelize);
initCategory(sequelize);

const User = sequelize.models.user;
const Post = sequelize.models.post;
const ImageFromPost = sequelize.models.imageFromPost;
const Category = sequelize.models.category;

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

sequelize.sync({ alter: true });

const db = {
    sequelize: sequelize,
    options: dbOptions
};

module.exports = db;