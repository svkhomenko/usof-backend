const bcrypt  = require("bcrypt");
// const jwt  = require("jsonwebtoken");
const path = require("path");
const fs  = require("fs");
const db = require("../../models/init.js");

const { signJWTToken } = require('../../initJTWR');

const User = db.sequelize.models.user;

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

// function generateAccessToken(payload) {
//     return jwt.sign(payload, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE_SEC, });
// }

// async function checkErrors(data, user) {
//     let res = {};

//     if (!(user && bcrypt.compareSync(data.password, user.password))) {
//         res.type = TYPE_ERROR;
//         res.text = 'Login or password is invalid';
//         return res;
//     }

//     res.type = TYPE_SUCCESS;
//     res.text = '';
//     // res.text = 'You are successfully logged!';

//     return res; 
// }

// async function login(req, res) {
//     const data = req.body;

//     let user = await User.findOne({
//         where: {
//             login: data.login
//         }
//     }).catch(err => console.log(err));

//     let result = await checkErrors(data, user);
    
//     if (result.type === TYPE_SUCCESS) {
//         const token = generateAccessToken({id: user.id, nickname: user.nickname });
//         res.cookie('token', token, {sameSite: 'Lax', maxAge: TOKEN_EXPIRE_SEC * 1000,});
//         result.redirect = `/?id=${user.id}`;
//     }

//     res.json(result);
// }

// export default login;











const nodemailer = require('nodemailer');
const { text } = require("express");

const nodemailerFilePath = path.resolve("configs", "nodemailer-config.json");
const nodemailerOptFile = fs.readFileSync(nodemailerFilePath);
const nodemailerOptions = JSON.parse(nodemailerOptFile);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: nodemailerOptions.user,
        pass: nodemailerOptions.pass
    }
});

// function sendEmail(email, login, password) {
//     transporter.sendMail({
//         from: '"Usof" <ucodeskhomenko@gmail.com>',
//         to: email,
//         subject: 'Confirm your password in Usof',
//         text: `Hi ${login}! Click the link to comfirm your password in Usof. The link will be active for 2 hours`,
//         html: `Hi ${login}!<br>Click <a href="http://localhost:3000/api/auth/password-reset/${generateAccessToken(email)}">the link</a> to comfirm your password in Usof. The link will be active for 2 hours`
//         // html: `Hi ${login}!<br>Click 
//         //         <from action="http://localhost:3000/api/auth/password-reset/${generateAccessToken(email)}" 
//         //                 method="POST">
//         //             <input type="hidden" id="email" value="${email}">
//         //             <input type="hidden" id="newPassword" value="${password}">
//         //             <button type="submit">
//         //                 the link
//         //             </button>
//         //         </form>
//         //         to comfirm your password in Usof. The link will be active for 2 hours`
//         // html: `Hi ${login}!<br>Click 
//         //         <from action="http://localhost:3000/api/auth/password-reset/${generateAccessToken(email)}" 
//         //                 method="POST">
//         //             <input type="text" id="email" value="${email}" hidden>
//         //             <input type="text" id="newPassword" value="${password}" hidden>
//         //             <a href="#" onclick="document.getElementById('myform').submit(); return false;"> the link </a>
//         //         </form>
//         //         to comfirm your password in Usof. The link will be active for 2 hours`
//         // html: `Hi ${login}!<br>Click 
//         //             <a href="/kjli" onclick="console.log('here'); fetch('http://localhost:3000/api/auth/password-reset/${generateAccessToken(email)}'); return false;"> the link </a>
//         //         to comfirm your password in Usof. The link will be active for 2 hours`
//     },
//     err => {
//         if (err) {
//             console.log(err);
//         }
//     });    
// }

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

async function generateToken(payload) {
    return await signJWTToken(payload, tokenOptions.secret, { expiresIn: tokenOptions.expire_sec });
    // return jwt.sign(payload, tokenOptions.secret, { expiresIn: tokenOptions.expire_sec });
}

module.exports = {
    sendEmail,
    generateToken
};

