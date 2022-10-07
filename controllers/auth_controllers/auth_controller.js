const register = require('./register');
const confirmEmail = require('./confirmEmail');
const login = require('./login');
const logout = require('./logout');
const sendPasswordConfirmation = require('./sendPasswordConfirmation');
const confirmPassword = require('./confirmPassword');

module.exports = {
    register,
    confirmEmail,
    login,
    logout,
    sendPasswordConfirmation,
    confirmPassword
};

