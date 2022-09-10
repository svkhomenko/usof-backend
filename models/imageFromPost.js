const { DataTypes } = require("sequelize");

const setPicturePath = require("./setPicturePath");

module.exports = function initImageFromPost (sequelize) {
    const ImageFormPost = sequelize.define("imageFromPost", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        image: {
            type: DataTypes.BLOB("long"),
            // get() {
            //     const rawValue = this.getDataValue("image");
            //     return rawValue ? Buffer.from(rawValue, "binary").toString("base64") : null; 
            // }
        },
        picturePath: {
            type: DataTypes.VIRTUAL,
            set(value) {
                setPicturePath(this, value, "image")
            }
        },
    },
    { 
        timestamps: false,
        // hooks: {
        //     beforeUpdate: (instance) => {
        //         if (!(instance.dataValues.image instanceof Buffer)) {
        //             instance.dataValues.image = instance._previousDataValues.image;
        //         }
        //     }
        // }
    });
}
