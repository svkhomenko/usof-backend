const getAllCategories = require('./getAllCategories');
const getCategoryById = require('./getCategoryById');
const getCategoryPostsById = require('./getCategoryPostsById');
const createNewCategory = require('./createNewCategory');
const updateCategoryData = require('./updateCategoryData');
const deleteCategory = require('./deleteCategory');

module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoryPostsById,
    createNewCategory,
    updateCategoryData,
    deleteCategory
};

