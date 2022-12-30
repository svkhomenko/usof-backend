const path = require("path");
const fs  = require("fs");
const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const { verifyJWTToken } = require('../../token/tokenTools');
const User = db.sequelize.models.user;

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function getUserById(req, res) {
    const token = req.headers.authorization;
    const id = req.params.user_id;

    try {
        let decoded;
        let curUser;
        
        try {
            decoded = await verifyJWTToken(token, tokenOptions.secret);
        }
        catch (err) {}

        if (decoded && decoded.id) {
            curUser = await User.findByPk(decoded.id);
        }

        let user = await User.findByPk(id);
        if (!user) {
            throw new ValidationError("No user with this id", 404);
        }

        if ((!curUser || (curUser && curUser.role !== 'admin')) 
            && user.status === "pending") {
            throw new ValidationError("Forbidden data", 403); 
        }
        
        user = {
            id: user.id,
            login: user.login,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
            rating: await user.getRating(),
            status: user.status
        };
        
        res.status(200)
            .json(user);
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

            res.status(500)
                .json({ message: err });
        } 
    }    
}

module.exports = getUserById;

