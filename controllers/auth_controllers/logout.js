const { destroyJWTToken } = require('../../token/tokenTools');

async function logout(req, res) {
    const token = req.headers.authorization;
    
    try {
        await destroyJWTToken(token);
        
        res.status(200).send();
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

module.exports = logout;

