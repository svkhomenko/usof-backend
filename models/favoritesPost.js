const { DataTypes } = require("sequelize");

module.exports = function initFavoritesPost (sequelize) {
    const FavoritesPost = sequelize.define("favoritesPost", 
    {
        userId: {
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
    },
    { 
        timestamps: false
    });
}

