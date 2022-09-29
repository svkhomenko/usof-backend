const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const Category = db.sequelize.models.category;

async function getCategoryById(req, res) {
    const categoryId = req.params.category_id;

    try {
        const category = await Category.findByPk(categoryId);

        if (!category) {
            throw new ValidationError("No category with this id", 404);
        }
        
        res.status(200)
            .json({
                category
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

module.exports = getCategoryById;

