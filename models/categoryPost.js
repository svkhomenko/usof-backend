const { DataTypes } = require("sequelize");

module.exports = function initCategoryPost (sequelize) {
    const CategoryPost = sequelize.define("categoryPost", 
    {
        categoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'Category',
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