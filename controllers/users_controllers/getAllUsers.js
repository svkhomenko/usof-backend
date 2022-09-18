const path = require("path");
const fs  = require("fs");
const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const { verifyJWTToken } = require('../../token/tokenTools');
const User = db.sequelize.models.user;

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function getAllUsers(req, res) {
    const token = req.headers.authorization;
    try {
        const decoded = await verifyJWTToken(token, tokenOptions.secret);

        const curUser = await User.findByPk(decoded.id);
        if (!curUser) {
            throw new ValidationError("Invalid token", 401);
        }

        let allUsers;
        if (curUser.role === 'admin') {
            allUsers = await User.findAll();
        }
        else {
            allUsers = await User.findAll({
                where: {
                    status: 'active'
                },
            });
        }
        
        allUsers = await Promise.all(allUsers.map(async (user) => {
            return ({
                id: user.id,
                login: user.login,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                rating: await user.getRating(),
                status: user.status
            });
        }));
        
        res.status(200)
            .json(allUsers);
    }
    catch(err) {
        if (err instanceof ValidationError) {
            res.status(err.status)
                .json({ message: err.message });
        }
        else if (err.name == 'SequelizeValidationError') {
            res.status(400)
                .json({ message: err.errors[0].message });
        }
        else {
            console.log('err', err);

            res.status(400)
                .json({ message: err });
        } 
    }    
}

module.exports = getAllUsers;

