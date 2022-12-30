const express = require("express");
const bodyParser = require('body-parser');
const app = express();

const cors = require('cors');
app.use(cors({
    origin: '*',
    exposedHeaders: "Location"
}));

app.use(express.static('uploads'));
app.use('/uploads', express.static('uploads'));

const { adminJs, adminJsrouter } = require('./adminjsConnection');
app.use(adminJs.options.rootPath, adminJsrouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./token/deleteTokens')();

const authRouter = require("./routes/auth_router.js");
const usersRouter = require("./routes/users_router.js");
const postsRouter = require("./routes/posts_router.js");
const categoriesRouter = require("./routes/categories_router.js");
const commentsRouter = require("./routes/comments_router.js");

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/comments", commentsRouter);
 
app.use(function (req, res) {
    res.status(404)
    .json({
        message: "Not Found"
    });
});

const server = app.listen(3000, () => {
    console.log(`Server is running at port 3000`);
});

server.on('connection', function(socket) {
    socket.setTimeout(30 * 1000); 
    server.keepAliveTimeout = 30000; 
    server.headersTimeout = 31000; 
});

