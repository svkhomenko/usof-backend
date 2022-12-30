const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const Category = db.sequelize.models.category;
const { validateTitle, validateDescription } = require('../tools/dataValidation');

async function updateCategoryData(req, res) {
    const categoryId = req.params.category_id;
    const { title, description } = req.body;
    
    try {
        let curCategory = await Category.findByPk(categoryId);
        if (!curCategory) {
            throw new ValidationError("No category with this id", 400);
        }

        if (title) {
            validateTitle(title);
            curCategory.set({
                title
            });
        }
        if (description) {
            validateDescription(description);
            curCategory.set({
                description
            });
        }
        
        curCategory = await curCategory.save();

        res.status(200)
            .json({
                curCategory
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

module.exports = updateCategoryData;

