const getAllUsers = require('./getAllUsers');
const getUserById = require('./getUserById');
const createNewUser = require('./createNewUser');
const uploadAvatar = require('./uploadAvatar');
const uploadUserData = require('./uploadUserData');
const deleteUser = require('./deleteUser');

module.exports = {
    getAllUsers,
    getUserById,
    createNewUser,
    uploadAvatar,
    uploadUserData,
    deleteUser
};

