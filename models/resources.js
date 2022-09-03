const bcrypt  = require("bcrypt");
const db = require("./init.js");

const User = db.sequelize.models.user; 

module.exports = [
    {
        resource: User,
        options: {
            listProperties: ['id', 'login', 'fullName', 'email', 'profilePicture', 'role'],
            actions: {
                new: {
                    before: hashPassword
                },
                edit: {
                    before: hashPassword
                }
            }
        }
    }
];

async function hashPassword(request) {
    if (request.payload.password) {
        let salt = bcrypt.genSaltSync(10);
        request.payload = {
            ...request.payload,
            password: await bcrypt.hash(request.payload.password, salt)
        }
    }
    return request;
}
