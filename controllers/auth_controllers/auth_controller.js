const register = require('./register');
const sendEmailConfirmation = require('./sendEmailConfirmation');
const confirmEmail = require('./confirmEmail');
const login = require('./login');
const confirmPassword = require('./confirmPassword');

module.exports = {
    register,
    sendEmailConfirmation,
    confirmEmail,
    login,
    confirmPassword
};

