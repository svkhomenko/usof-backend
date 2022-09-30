const { DataTypes } = require("sequelize");
const path = require("path");
const fs = require("fs");

module.exports = function initUser(sequelize) {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [2, 50],
                is: /^[a-zA-Z0-9 ]+$/
            }
        },
        encryptedPassword: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 50],
                is: /^[a-zA-Z ]+$/
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        profilePicture: {
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
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            allowNull: false,
            defaultValue: "user"
        },
        status: {
            type: DataTypes.ENUM('pending', 'active'),
            allowNull: false,
            defaultValue: "pending"
        }
    },
    {
        timestamps: false,
        hooks: {
            beforeUpdate: async function (instance) {
                if (instance.email !== instance._previousDataValues.email) {
                    instance.status = "pending";
                }
                
                let prevPath = instance._previousDataValues.picturePath;
                if (instance._changed.has('picturePath') && prevPath) {
                    const pictureFilePath = path.resolve("uploads", prevPath);
                    if (fs.existsSync(pictureFilePath)) {
                        await fs.promises.unlink(pictureFilePath);
                    }
                }
            },
            beforeDestroy: async function (instance) {
                if (instance.picturePath) {
                    const pictureFilePath = path.resolve("uploads", instance.picturePath);
                    if (fs.existsSync(pictureFilePath)) {
                        await fs.promises.unlink(pictureFilePath);
                    }
                }
            }
        }
    });
}

