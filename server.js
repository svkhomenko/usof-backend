const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSSequelize = require('@adminjs/sequelize');
const express = require("express");
const app = express();

// app.use('/static', express.static('public'));

const db = require("./models/init.js");
// console.log(db.sequelize.models);
const adminJsResources = require("./models/resources");

AdminJS.registerAdapter(AdminJSSequelize);

const adminJs = new AdminJS({
    databases: [db],
    resources: adminJsResources,
    rootPath: '/admin',
});

const router = AdminJSExpress.buildRouter(adminJs);
app.use(adminJs.options.rootPath, router);

app.get('/', (req, res) => {
    res.send("jdfxhkc");
});

app.listen(3000);