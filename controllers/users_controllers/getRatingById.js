const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const User = db.sequelize.models.user;

async function getRatingById(req, res) {
    const id = req.params.user_id;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            throw new ValidationError("No user with this id", 404);
        }
        
        res.status(200).json({ rating: await user.getRating() });
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

            res.status(400)
                .json({ message: err });
        } 
    }    
}

module.exports = getRatingById;

