const bcrypt  = require("bcrypt");
const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const { generateToken } = require('../tools/sendEmail');

const User = db.sequelize.models.user;

async function login(req, res) {
    const { login, password } = req.body;
    
    try {
        if (!login || !password) {
            throw new ValidationError("Wrong login and/or password", 400);
        }
        
        const user = await User.findOne({
            where: {
                login: login
            },
        });
        if (!user || !bcrypt.compareSync(password, user.encryptedPassword)) {
            throw new ValidationError("Wrong login and/or password", 400);
        }

        if (user.status !== 'active') {
            throw new ValidationError("Your email is not confirmed. Check your email", 403);
        }
        
        res.status(200)
            .json({ 
                id: user.id,
                login: user.login,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                rating: await user.getRating(),
                token: await generateToken({ id: user.id, login: user.login }, "secret"),
                status: user.status
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

            res.status(400)
                .json({ message: err });
        } 
    }    
}

module.exports = login;

