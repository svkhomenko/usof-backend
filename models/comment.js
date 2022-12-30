const { Sequelize, DataTypes } = require("sequelize");

module.exports = function initComment(sequelize) {
    const Comment = sequelize.define("comment", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
            validate: {
                notEmpty: true
            }
        }
    },
    { 
        timestamps: false,
        hooks: {
            beforeCount: function (options) {
                if (this._scope.include && this._scope.include.length > 0) {
                  options.distinct = true
                  options.col = this._scope.col || options.col || `"${this.options.name.singular}".id`
                }
              
                if (options.include && options.include.length > 0) {
                  options.include = null
                }
            }
        }
    });
}

