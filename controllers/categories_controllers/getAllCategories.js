const { Op } = require("sequelize");
const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const Category = db.sequelize.models.category;

async function getAllCategories(req, res) {
    try {
        let limit = 10;
        let offset = 0;
        if (req.query.page) {
            if (req.query.page < 1) {
                throw new ValidationError("No such page", 400);
            }
            offset = (req.query.page - 1) * limit;
        }
        
        let where = {};
        if (req.query.search) {
            where = {
                title: {
                    [Op.substring]: req.query.search
                }
            };
        }

        let {count: countCategories, rows: allCategories} = await Category.findAndCountAll({
            where: where,
            offset: offset,
            limit: limit
        });
        
        res.status(200)
            .json({
                limit,
                countCategories,
                allCategories
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

module.exports = getAllCategories;

