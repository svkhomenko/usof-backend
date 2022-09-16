const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const { sendEmail } = require('./sendEmail');

const User = db.sequelize.models.user;

async function sendEmailConfirmation(req, res) {
    const data = req.body;

    try {
        if (!data.link) {
            throw new ValidationError("No link for email confirmation", 400);
        }
        if (!data.email) {
            throw new ValidationError("No email for email confirmation", 400);
        }
        
        const user = await User.findOne({
            where: {
                email: data.email
            },
        });

        if (!user) {
            throw new ValidationError("No user with this email found", 404);
        }
        
        const subject = 'Confirm your email in Usof';
        const text = `Hi ${user.login}! Click the link to comfirm your email in Usof. The link will be active for 2 hours`;
        const html = `Hi ${user.login}!<br>Click <a href="${data.link}">the link</a> to comfirm your email in Usof. The link will be active for 2 hours`;
        sendEmail(data.email, subject, text, html);
    
        res.status(204).send();
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

            res.status(400)
                .json({ message: err });
        } 
    }
}

module.exports = sendEmailConfirmation;

