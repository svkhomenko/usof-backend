const { Sequelize, DataTypes } = require("sequelize");

module.exports = function initToken(sequelize) {
    const Token = sequelize.define("token", {
        token: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        }
    },
    { 
        timestamps: true,
        updatedAt: false
    });
}

