const express = require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('uploads'));
app.use('/uploads', express.static('uploads'));

const { adminJs, adminJsrouter } = require('./adminjsConnection');
app.use(adminJs.options.rootPath, adminJsrouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./deleteTokens')();

const authRouter = require("./routes/auth_router.js");

app.use("/api/auth", authRouter);
 
app.use(function (req, res) {
    res.status(404)
    .json({
        message: "Not Found"
    });
});

const server = app.listen(3000);

server.on('connection', function(socket) {
    socket.setTimeout(30 * 1000); 
    server.keepAliveTimeout = 30000; 
    server.headersTimeout = 31000; 
});

