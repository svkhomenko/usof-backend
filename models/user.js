const { DataTypes } = require("sequelize");
const bcrypt  = require("bcrypt");
const path = require("path");
const fs = require("fs");

module.exports = function initUser (sequelize) {
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
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 50],
                validatePassword
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
            type: DataTypes.BLOB("long"),
            get() {
                const rawValue = this.getDataValue("profilePicture");
                return rawValue ? Buffer.from(rawValue, "binary").toString("base64") : null; 
            }
        },
        picturePath: {
            type: DataTypes.VIRTUAL,
            set: setPicturePath
        },
        rating: {
            type: DataTypes.VIRTUAL,
            get: getRating
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            allowNull: false,
            defaultValue: "user"
        }
    },
    {
        hooks: {
            beforeUpdate: (instance) => {
                if (instance.dataValues.password !== instance._previousDataValues.password) {
                    let salt = bcrypt.genSaltSync(10);
                    instance.dataValues.password = bcrypt.hashSync(instance.dataValues.password, salt);
                }

                if (!(instance.dataValues.profilePicture instanceof Buffer)) {
                    instance.dataValues.profilePicture = instance._previousDataValues.profilePicture;
                }
            }
        }
    });

    async function getRating() {
        // const User = sequelize.models.user; 
        const id = this.getDataValue("id");
        const user = await User.findOne({
            where: {
              id: id
            },
            include: sequelize.models.post
        });
        // const posts = await user.getPosts();
        // console.log(posts);
        console.log(user);
        return id;
    }
}

function validatePassword(password) {
    if (!/^[a-zA-Z0-9]+$/.test(password)) {
        throw new Error("Password must containt only a-z, A-Z, 0-9");
    }
    if (!/(?=.*\d)/.test(password)) {
        throw new Error("Password must containt at least one digit");
    }
    if (!/(?=.*[a-z])/.test(password)) {
        throw new Error("Password must containt at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
        throw new Error("Password must containt at least one uppercase letter");
    }
}

function setPicturePath(value) {
    this.setDataValue("picturePath", value);

    if (value) {
        const filePath = path.resolve("uploads", value);
        let file;
        try {
            file = fs.readFileSync(filePath);
        }
        catch(error) {
            console.log('setter picturePath', error);
        }

        if (file) {
            this.setDataValue("profilePicture", file);
            fs.rmSync(filePath);

            const dirPath = path.resolve("uploads", path.dirname(value));
            if (fs.existsSync(dirPath) && fs.readdirSync(dirPath).length === 0) {
                fs.rmdirSync(dirPath);
            }
        }
    }
}
