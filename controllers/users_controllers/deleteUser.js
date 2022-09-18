const db = require("../../models/init.js");
const User = db.sequelize.models.user;

async function deleteUser(req, res) {
    const id = req.params.user_id;

    try {
        await User.destroy({
            where: {
                id: id
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

            res.status(400)
                .json({ message: err });
        } 
    }    
}

module.exports = deleteUser;

