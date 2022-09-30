const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSSequelize = require('@adminjs/sequelize');
const bcrypt  = require("bcrypt");

const db = require("./models/init.js");
const adminJsResources = require("./models/resources/resources");

AdminJS.registerAdapter(AdminJSSequelize);

const adminJs = new AdminJS({
    resources: adminJsResources,
    rootPath: '/admin',
});

const adminJsrouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: async (email, password) => {
        const user = await db.sequelize.models.user.findOne({ where: { email: email } });
        if (user && user.role === 'admin' && user.status === 'active') {
            const matched = await bcrypt.compare(password, user.encryptedPassword);
            if (matched) {
                return user;
            }
        }
        return false;
    },
    cookiePassword: 'some-secret-password-used-to-secure-cookie'
}, null, {
    resave: true,
    saveUninitialized: true
});

module.exports = {
    adminJs,
    adminJsrouter
};

