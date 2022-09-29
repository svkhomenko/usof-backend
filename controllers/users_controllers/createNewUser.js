const bcrypt  = require("bcrypt");
const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const { sendEmail, generateToken } = require('../tools/sendEmail');
const { checkPasswordConfirmation, validatePassword, validateLogin, validateFullName, validateEmail, validateRole } = require('../tools/dataValidation');

const User = db.sequelize.models.user;

async function createNewUser(req, res) {
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
        validateRole(data.role);

        let salt = bcrypt.genSaltSync(10);

        await User.create({
            login: data.login,
            encryptedPassword: bcrypt.hashSync(data.password, salt),
            fullName: data.fullName,
            email: data.email,
            role: data.role
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

module.exports = createNewUser;

