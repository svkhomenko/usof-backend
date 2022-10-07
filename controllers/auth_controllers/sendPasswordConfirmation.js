const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const { sendEmail, generateToken } = require('../tools/sendEmail');

const User = db.sequelize.models.user;

async function sendPasswordConfirmation(req, res) {
    const data = req.body;
    
    try {
        if (!data.link) {
            throw new ValidationError("No link for password reset confirmation", 400);
        }
        if (!data.email) {
            throw new ValidationError("No email for password reset confirmation", 400);
        }
        
        const user = await User.findOne({
            where: {
                email: data.email
            },
        });

        if (!user) {
            throw new ValidationError("No user with this email found", 404);
        }

        let link = data.link;
        if (link[link.length - 1] !== '/') {
            link += '/';
        }
        link += (await generateToken({ email: data.email, password: "password" }, "secret_password")).replaceAll('.', 'dot');

        const subject = 'Confirm your password reset in Usof';
        const text = `Hi ${user.login}! Click the link to comfirm your password reset in Usof. The link will be active for 2 hours`;
        const html = `Hi ${user.login}!<br>Click <a href="${link}">the link</a> to comfirm your password reset in Usof. The link will be active for 2 hours`;
        sendEmail(data.email, subject, text, html);
    
        res.status(200).send();
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
            console.log('err', err, err.message);

            res.status(500)
                .json({ message: err });
        } 
    }
}

module.exports = sendPasswordConfirmation;

