const db = require("../../models/init.js");
const Category = db.sequelize.models.category;

async function deleteCategory(req, res) {
    const categoryId = req.params.category_id;

    try {
        await Category.destroy({
            where: {
                id: categoryId
            }
        });
        
        res.status(204).send();
    }
    catch(err) {
        if (err.name == 'SequelizeValidationError') {
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

module.exports = deleteCategory;

