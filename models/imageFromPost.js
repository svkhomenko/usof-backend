const { DataTypes } = require("sequelize");

module.exports = function initImageFromPost (sequelize) {
    const ImageFormPost = sequelize.define("imageFromPost", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        image: {
            type: DataTypes.BLOB("long"),
            allowNull: false,
            get() {
                const rawValue = this.getDataValue("profilePicture");
                return rawValue ? Buffer.from(rawValue, "binary").toString("base64") : null; 
            }
        }
    });
}