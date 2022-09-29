// const bcrypt  = require("bcrypt");
// const db = require("../../models/init.js");
// const ValidationError = require('../../errors/ValidationError');
// const { generateToken } = require('./sendEmail');

// const User = db.sequelize.models.user;

// function checkPasswordConfirmation(data) {
//     if (data.password !== data.passwordConfirmation) {
//         throw new ValidationError("Password and password confirmation do not match", 400);
//     }
// }

// async function validatePassword(password) {
//     if (!/^[a-zA-Z0-9]+$/.test(password)) {
//         throw new ValidationError("Password must containt only a-z, A-Z, 0-9", 400);
//     }
//     if (!/(?=.*\d)/.test(password)) {
//         throw new ValidationError("Password must containt at least one digit", 400);
//     }
//     if (!/(?=.*[a-z])/.test(password)) {
//         throw new ValidationError("Password must containt at least one lowercase letter", 400);
//     }
//     if (!/(?=.*[A-Z])/.test(password)) {
//         throw new ValidationError("Password must containt at least one uppercase letter", 400);
//     }
// }

// async function validateLogin(login) {
//     const user = await User.findOne({
//         where: {
//             login: login
//         }
//     });

//     if (user) {
//         throw new ValidationError("The user with this login already exists", 400);
//     }

//     if (login.length < 2 || login.length > 50) {
//         throw new ValidationError("Login length must be from 2 to 50 characters", 400);
//     }
//     if (!/^[a-zA-Z0-9 ]+$/.test(login)) {
//         throw new ValidationError("Login must containt only a-z, A-Z, 0-9 or whitespace", 400);
//     }
// }

// function validateFullName(fullName) {
//     if (fullName.length < 2 || fullName.length > 50) {
//         throw new ValidationError("Login length must be from 2 to 50 characters", 400);
//     }
//     if (!/^[a-zA-Z ]+$/.test(fullName)) {
//         throw new ValidationError("Login must containt only a-z, A-Z or whitespace", 400);
//     }
// }

// async function validateEmail(email) {
//     const user = await User.findOne({
//         where: {
//             email: email
//         }
//     });

//     if (user) {
//         throw new ValidationError("The user with this email already exists", 400);
//     }
// }

// async function register(req, res) {
//     const data = req.body;
    
//     try {
//         checkPasswordConfirmation(data);
//         await validatePassword(data.password);
//         await validateLogin(data.login);
//         validateFullName(data.fullName);
//         await validateEmail(data.email);

//         let salt = bcrypt.genSaltSync(10);

//         await User.create({
//             login: data.login,
//             encryptedPassword: bcrypt.hashSync(data.password, salt),
//             fullName: data.fullName,
//             email: data.email
//         });

//         res.status(201).json({ confirmTokenForEmail: await generateToken({ email: data.email }) });
//     }
//     catch(err) {
//         if (err instanceof ValidationError) {
//             res.status(err.status)
//                 .json({ message: err.message });
//         }
//         else if (err.name == 'SequelizeValidationError') {
//             res.status(400)
//                 .json({ message: err.errors[0].message });
//         }
//         else {
//             console.log('err', err);

//             res.status(400)
//                 .json({ message: err });
//         } 
//     }    
// }

// module.exports = register;


const bcrypt  = require("bcrypt");
const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const { sendEmail, generateToken } = require('../tools/sendEmail');
const { checkPasswordConfirmation, validatePassword, validateLogin, validateFullName, validateEmail } = require('../tools/dataValidation');

const User = db.sequelize.models.user;

async function register(req, res) {
    const data = req.body;
    
    try {
        if (!data.link) {
            throw new ValidationError("No link for email confirmation", 400);
        }
        checkPasswordConfirmation(data);
        await validatePassword(data.password);
        await validateLogin(data.login);
        validateFullName(data.fullName);
        await validateEmail(data.email);

        let salt = bcrypt.genSaltSync(10);

        await User.create({
            login: data.login,
            encryptedPassword: bcrypt.hashSync(data.password, salt),
            fullName: data.fullName,
            email: data.email
        });

        let link = data.link;
        if (link[link.length - 1] !== '/') {
            link += '/';
        }
        link += await generateToken({ email: data.email }, "secret_email");

        const subject = 'Confirm your email in Usof';
        const text = `Hi ${data.login}! Click the link to comfirm your email in Usof. The link will be active for 2 hours`;
        const html = `Hi ${data.login}!<br>Click <a href="${link}">the link</a> to comfirm your email in Usof. The link will be active for 2 hours`;
        sendEmail(data.email, subject, text, html);

        res.status(201).send();

        // const subject = 'Confirm your email in Usof';
        // const text = `Hi ${data.login}! Click the link to comfirm your email in Usof. The link will be active for 2 hours`;
        // const html = `Hi ${data.login}!<br>Click <a href="${data.link}">the link</a> to comfirm your email in Usof. The link will be active for 2 hours`;
        // sendEmail(data.email, subject, text, html);

        // res.status(201).json({ confirmTokenForEmail: await generateToken({ email: data.email }, "secret_email") });
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

module.exports = register;

