const { Sequelize } = require("sequelize");
const path = require("path");
const fs  = require("fs");
const db = require("../models/init.js");

const Token = db.sequelize.models.token;

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const { expire_sec } = JSON.parse(tokenOptFile);

function destroyTokens() {
    const { Op } = Sequelize;
    const threshold = new Date(Date.now() - expire_sec * 1000);
    Token.destroy({
        where: {
            createdAt: { 
                [Op.lt]: threshold,
            },
        }})
    .catch();
}

module.exports = function deleteTokens() {
    setTimeout(destroyTokens, expire_sec * 1000);
}

