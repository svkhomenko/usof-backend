const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSSequelize = require('@adminjs/sequelize');
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

const router = AdminJSExpress.buildRouter(adminJs);
app.use(adminJs.options.rootPath, router);

app.get('/', (req, res) => {
    res.send("jdfxhkc");
});

// app.listen(3000);

let server = app.listen(3000);

server.on('connection', function(socket) {
    socket.setTimeout(30 * 1000); 
    server.keepAliveTimeout = 30000; 
    server.headersTimeout = 31000; 
});