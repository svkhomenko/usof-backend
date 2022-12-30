const path = require("path");
const fs  = require("fs");
const db = require("../../models/init.js");
const { Op } = require("sequelize");
const ValidationError = require('../../errors/ValidationError');
const { verifyJWTToken } = require('../../token/tokenTools');
const User = db.sequelize.models.user;

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function getAllUsers(req, res) {
    const token = req.headers.authorization;

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

        let limit = 50;
        let offset = 0;
        if (req.query.page) {
            if (req.query.page < 1) {
                throw new ValidationError("No such page", 400);
            }
            offset = (req.query.page - 1) * limit;
        }

        let where = {};
        if (!(curUser && curUser.role === 'admin')) {
            where = {
                status: 'active'
            };
        }
        
        if (req.query.search) {
            where = {
                ...where,
                [Op.or]: [
                    { 
                        login: {
                            [Op.substring]: req.query.search
                        }
                    },
                    { 
                        fullName: {
                            [Op.substring]: req.query.search
                        }
                    },
                    { 
                        email: {
                            [Op.substring]: req.query.search
                        }
                    }
                ] 
            };
        }

        let {count: countUsers, rows: allUsers} = await User.findAndCountAll({
            where: where,
            offset: offset,
            limit: limit
        });

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
            .json({
                limit,
                countUsers,
                allUsers
            });
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

module.exports = getAllUsers;

