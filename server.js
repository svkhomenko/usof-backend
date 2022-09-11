const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSSequelize = require('@adminjs/sequelize');
const bcrypt  = require("bcrypt");
const express = require("express");
const app = express();

app.use(express.static('uploads'));
app.use('/uploads', express.static('uploads'));

const db = require("./models/init.js");
const adminJsResources = require("./models/resources");

AdminJS.registerAdapter(AdminJSSequelize);

const adminJs = new AdminJS({
    databases: [db],
    resources: adminJsResources,
    rootPath: '/admin',
});

// const adminJsrouter = AdminJSExpress.buildRouter(adminJs);

const adminJsrouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: async (email, password) => {
        const user = await db.sequelize.models.user.findOne({ where: { email: email } });
        if (user && user.role === 'admin') {
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

app.use(adminJs.options.rootPath, adminJsrouter);

// app.get('/', (req, res) => {
//     res.send("jdfxhkc");
// });

// app.listen(3000);

let server = app.listen(3000);

server.on('connection', function(socket) {
    socket.setTimeout(30 * 1000); 
    server.keepAliveTimeout = 30000; 
    server.headersTimeout = 31000; 
});