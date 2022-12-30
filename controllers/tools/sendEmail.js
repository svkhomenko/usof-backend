const nodemailer = require('nodemailer');
const path = require("path");
const fs  = require("fs");
const db = require("../../models/init.js");
const { signJWTToken } = require('../../token/tokenTools');

const User = db.sequelize.models.user;

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

const nodemailerFilePath = path.resolve("configs", "nodemailer-config.json");
const nodemailerOptFile = fs.readFileSync(nodemailerFilePath);
const nodemailerOptions = JSON.parse(nodemailerOptFile);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: 'gmail',
    auth: {
        user: nodemailerOptions.user,
        pass: nodemailerOptions.pass
    }
});

function sendEmail(email, subject, text, html) {
    transporter.sendMail({
        from: '"Usof" <ucodeskhomenko@gmail.com>',
        to: email,
        subject: subject,
        text: text,
        html: html
    },
    err => {
        if (err) {
            console.log(err);
        }
    });    
}

async function generateToken(payload, secret) {
    return await signJWTToken(payload, tokenOptions[secret], { expiresIn: tokenOptions.expire_sec });
}

module.exports = {
    sendEmail,
    generateToken
};

