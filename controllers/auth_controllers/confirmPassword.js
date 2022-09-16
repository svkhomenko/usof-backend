// const jwt  = require("jsonwebtoken");
const path = require("path");
const fs  = require("fs");

const { verifyJWTToken } = require('../../initJTWR');

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function confirmPassword(req, res) {
    const data = req.body;
    console.log("confirm", req.params);

    const confirmToken = req.params.confirm_token;

    try {
        const decoded = await verifyJWTToken(confirmToken, tokenOptions.secret);
        // const decoded = jwt.verify(confirmToken, tokenOptions.secret);
    } catch (err) {
        res.status(401).send("Invalid Token");
    }

    res.status(201).send('nice');
}

module.exports = confirmPassword;

