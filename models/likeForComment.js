const { Sequelize, DataTypes } = require("sequelize");

module.exports = function initLikeForComment(sequelize) {
    const LikeForComment = sequelize.define("likeForComment", {
        author: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        commentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'Comment',
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