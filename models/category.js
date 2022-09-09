const { DataTypes } = require("sequelize");

module.exports = function initCategory (sequelize) {
    const Category = sequelize.define("category", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: { 
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        } 
    },
    { 
        timestamps: false
    });
}