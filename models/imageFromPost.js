const { DataTypes } = require("sequelize");
const path = require("path");
const fs = require("fs");

module.exports = function initImageFromPost(sequelize) {
    const ImageFromPost = sequelize.define("imageFromPost", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        image: {
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
                        return null;
                    }
        
                    return file;
                }
                return null;
            }
        },
        picturePath: {
            type: DataTypes.STRING
        }
    },
    { 
        timestamps: false,
        hooks: {
            beforeDestroy: async function (instance, options) {
                if (instance.picturePath) {
                    const pictureFilePath = path.resolve("uploads", "instance.picturePath");
                    if (fs.existsSync(pictureFilePath)) {
                        await fs.promises.unlink(pictureFilePath);
                    }
                }
            }
        }
    });
}

