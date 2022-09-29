const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const Category = db.sequelize.models.category;

async function createNewCategory(req, res) {
    const { title, description } = req.body;
    
    try {
        if (!title) {
            throw new ValidationError("Title is required", 400);
        }
        if (!description) {
            throw new ValidationError("Description is required", 400);
        }

        await Category.create({
            title,
            description
        });
        
        res.status(201).send();
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

module.exports = createNewCategory;

