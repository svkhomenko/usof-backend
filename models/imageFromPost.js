const { DataTypes } = require("sequelize");
const path = require("path");
const fs = require("fs");

module.exports = function initImageFromPost(sequelize) {
    const ImageFormPost = sequelize.define("imageFromPost", {
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
        }
    },
    { 
        timestamps: false,
    });
}
