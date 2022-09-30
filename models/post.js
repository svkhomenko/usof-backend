const { Sequelize, DataTypes } = require("sequelize");

module.exports = function initPost(sequelize) {
    const Post = sequelize.define("post", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        publishDate: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: "active"
        },
        content: { 
            type: DataTypes.TEXT,
            allowNull: false,
        }
    },
    { 
        timestamps: false
    });
}