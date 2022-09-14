const { DataTypes } = require("sequelize");
const path = require("path");
const fs = require("fs");

const setPicturePath = require("./setPicturePath");

module.exports = function initImageFromPost (sequelize) {
    const ImageFormPost = sequelize.define("imageFromPost", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        image: {
            // type: DataTypes.BLOB("long"),
            // get() {
            //     const rawValue = this.getDataValue("image");
            //     return rawValue ? Buffer.from(rawValue, "binary").toString("base64") : null; 
            // }
            type: DataTypes.VIRTUAL,
            get() {
                let fileName = this.getDataValue("picturePath");
        
                if (fileName) {
                    const filePath = path.resolve("uploads", fileName);
                    let file;
                    try {
                        file = fs.readFileSync(filePath);
                    }
                    catch(error) {
                        console.log('setter picturePath imageFromPost', error);
                        return null;
                    }
        
                    return file;
                }
                return null;
            }
        },
        picturePath: {
            type: DataTypes.STRING
            // type: DataTypes.VIRTUAL,
            // set(value) {
            //     setPicturePath(this, value, "image")
            // }
        }
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
