const getAllUsers = require('./getAllUsers');
const getUserById = require('./getUserById');
const createNewUser = require('./createNewUser');
// const login = require('./login');
// const logout = require('./logout');
// const sendPasswordConfirmation = require('./sendPasswordConfirmation');
const deleteUser = require('./deleteUser');

module.exports = {
    getAllUsers,
    getUserById,
    createNewUser,
    deleteUser
};

