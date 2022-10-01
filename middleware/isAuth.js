const path = require("path");
const fs  = require("fs");

const { verifyJWTToken } = require('../token/tokenTools');

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function isAuth(req, res, next) {
    const token = req.headers.authorization;

    try {
        const decoded = await verifyJWTToken(token, tokenOptions.secret);
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = isAuth;

