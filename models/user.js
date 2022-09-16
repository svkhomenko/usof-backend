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
                        console.log('setter picturePath user', error);
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
        // rating: {
        //     type: DataTypes.VIRTUAL,
        //     // get: getRating
        // },
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
    });

    // User.prototype.getRating = function() {
    //     // let bio = this.getDataValue('bio');
    //     // if (bio) {
    //     //     let bestFriend = await db.models.User.findById(this.getDataValue('BestFriendId'))
    //     //     if(bestFriend){
    //     //         bio += ` Best friend: ${bestFriend.name}.`;
    //     //     }
    //     //     return bio;
    //     // } else {
    //     //     return '';
    //     // }
    //     return 5;
    // }

    // async function getRating() {
    //     // const User = sequelize.models.user; 
    //     const id = this.getDataValue("id");
    //     // const user = await User.findOne({
    //     //     where: {
    //     //       id: id
    //     //     },
    //     //     include: sequelize.models.post
    //     // });
    //     // // const posts = await user.getPosts();
    //     // // console.log(posts);
    //     // console.log(user);
    //     return id;
    // }
}

// function validatePassword(password) {
//     if (!/^[a-zA-Z0-9]+$/.test(password)) {
//         throw new Error("Password must containt only a-z, A-Z, 0-9");
//     }
//     if (!/(?=.*\d)/.test(password)) {
//         throw new Error("Password must containt at least one digit");
//     }
//     if (!/(?=.*[a-z])/.test(password)) {
//         throw new Error("Password must containt at least one lowercase letter");
//     }
//     if (!/(?=.*[A-Z])/.test(password)) {
//         throw new Error("Password must containt at least one uppercase letter");
//     }
// }
