const jwt  = require("jsonwebtoken");
const ValidationError = require('../errors/ValidationError');
const db = require("../models/init.js");
const Token = db.sequelize.models.token;

async function signJWTToken(...data) {
    const token = await jwt.sign(...data);
    await Token.findOrCreate({
        where: {
            token: token
        }
    });
    return token;
}

async function verifyJWTToken(verToken, secret) {
    let data;
    try {
        data = jwt.verify(verToken, secret);
    } catch (err) {
        throw new ValidationError("Invalid token", 401);
    }
    
    const token = await Token.findOne({
        where: {
            token: verToken
        }
    });
    if (!token) {
        throw new ValidationError("Invalid token", 401);
    }
    return data;
}

async function destroyJWTToken(token) {
    await Token.destroy({
        where: {
            token: token
        }
    });
}

module.exports = {
    signJWTToken,
    verifyJWTToken,
    destroyJWTToken
};

