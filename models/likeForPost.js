const { Sequelize, DataTypes } = require("sequelize");

module.exports = function initLikeForPost(sequelize) {
    const LikeForPost = sequelize.define("likeForPost", {
        author: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        postId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'Post',
                key: 'id'
            }
        },
        publishDate: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('like', 'dislike'),
            allowNull: false,
            defaultValue: "like"
        }
    },
    { 
        timestamps: false
    });
}