const db = require("../../models/init.js");
const User = db.sequelize.models.user;
const { Op } = require("sequelize");
const ValidationError = require('../../errors/ValidationError');
const { sendEmail, generateToken } = require('../tools/sendEmail');
const { validateFullName, validateRole } = require('../tools/dataValidation');

async function validateNewLogin(login, id) {
    if (login) {
        const user = await User.findOne({
            where: {
                id: {
                    [Op.ne]: id
                },
                login: login
            }
        });
    
        if (user) {
            throw new ValidationError("The user with this login already exists", 400);
        }
    
        if (login.length < 2 || login.length > 50) {
            throw new ValidationError("Login length must be from 2 to 50 characters", 400);
        }
        if (!/^[a-zA-Z0-9 ]+$/.test(login)) {
            throw new ValidationError("Login must containt only a-z, A-Z, 0-9 or whitespace", 400);
        }
    }
}

async function validateNewEmail(email, id) {
    if (email) {
        const user = await User.findOne({
            where: {
                id: {
                    [Op.ne]: id
                },
                email: email
            }
        });
    
        if (user) {
            throw new ValidationError("The user with this email already exists", 400);
        }
        if (email.length > 200) {
            throw new ValidationError("Email length must be less than 200 characters", 400);
        }
    }
}

async function uploadUserData(req, res) {
    const id = req.params.user_id;
    const data = req.body;
    
    try {
        if (data.email && !data.link) {
            throw new ValidationError("No link for email confirmation", 400);
        }
        await validateNewLogin(data.login, id);
        if (data.fullName) {
            validateFullName(data.fullName);
        }
        await validateNewEmail(data.email, id);
        if (data.role) {
            validateRole(data.role);
        }

        let curUser = await User.findByPk(id);
        if (!curUser) {
            throw new ValidationError("No user with this id", 404);
        }

        if (data.email) {
            curUser.set({
                email: data.email
            });

            curUser = await curUser.save();

            let link = data.link;
            if (link[link.length - 1] !== '/') {
                link += '/';
            }
            link += (await generateToken({ email: data.email }, "secret_email")).replaceAll('.', 'dot');
    
            const subject = 'Confirm your email in Usof';
            const text = `Hi ${data.login}! Click the link to comfirm your email in Usof. The link will be active for 2 hours`;
            const html = `Hi ${data.login}!<br>Click <a href="${link}">the link</a> to comfirm your email in Usof. The link will be active for 2 hours`;
            sendEmail(data.email, subject, text, html);
        }

        if (data.login) {
            curUser.set({
                login: data.login
            });
        }

        if (data.fullName) {
            curUser.set({
                fullName: data.fullName
            });
        }

        if (req.file && req.file.filename) {
            curUser.set({
                picturePath: req.file.filename
            });
        }
        else if (data.deleteAvatar) {
            curUser.set({
                picturePath: null
            });
        }

        if (data.role && curUser.role == 'admin') {
            curUser.set({
                role: data.role
            });
        }

        curUser = await curUser.save();

        res.status(200)
            .json({
                id: curUser.id,
                login: curUser.login,
                fullName: curUser.fullName,
                email: curUser.email,
                role: curUser.role,
                profilePicture: curUser.profilePicture,
                rating: await curUser.getRating(),
                status: curUser.status
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

module.exports = uploadUserData;

