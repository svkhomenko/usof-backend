const bcrypt  = require("bcrypt");
let salt = bcrypt.genSaltSync(10);

async function createTestData(sequelize) {

    const User = sequelize.models.user;
    const Post = sequelize.models.post;
    const FavoritesPost = sequelize.models.favoritesPost;
    const ImageFromPost = sequelize.models.imageFromPost;
    const Category = sequelize.models.category;
    const CategoryPost = sequelize.models.categoryPost;
    const Comment = sequelize.models.comment;
    const ImageFromComment = sequelize.models.imageFromComment;
    const LikeForPost = sequelize.models.likeForPost;
    const LikeForComment = sequelize.models.likeForComment;

    const user1 = await User.create({
        login: 'Paul',
        encryptedPassword: bcrypt.hashSync('Password1', salt),
        fullName: 'Paul Hunt',
        email: 'admin@gmail.com',
        role: 'admin',
        status: 'active'
    });

    const user2 = await User.create({
        login: 'Dan',
        encryptedPassword: bcrypt.hashSync('Password2', salt),
        fullName: 'Daniel Hubbard',
        email: 'Dhubbard34@gmail.com',
        role: 'user',
        status: 'active',
        picturePath: 'avatar1.png'
    });

    const user3 = await User.create({
        login: 'AntonyM',
        encryptedPassword: bcrypt.hashSync('Password3', salt),
        fullName: 'Antony Miller',
        email: 'miller78@gmail.com',
        role: 'user',
        status: 'active',
        picturePath: 'avatar2.png'
    });

    const user4 = await User.create({
        login: 'Clare',
        encryptedPassword: bcrypt.hashSync('Password4', salt),
        fullName: 'Clare Bryan',
        email: 'CBryan@gmail.com',
        role: 'user',
        status: 'active',
        picturePath: 'avatar3.png'
    });

    const user5 = await User.create({
        login: 'Scott73',
        encryptedPassword: bcrypt.hashSync('Password5', salt),
        fullName: 'Scott Hill',
        email: 'HillS@gmail.com',
        role: 'user',
        status: 'pending'
    });

    const category1 = await Category.create({
        title: 'JavaScript',
        description: 'For questions regarding programming in ECMAScript (JavaScript/JS) and its various dialects/implementations.'
    });

    const category2 = await Category.create({
        title: 'Node.js',
        description: "Node.js is an event-based, non-blocking, asynchronous I/O runtime that uses Google's V8 JavaScript engine and libuv library. It is used for developing applications that make heavy use of the ability to run JavaScript both on the client as well as on the server side and therefore benefit from the re-usability of code and the lack of context switchin."
    });

    const category3 = await Category.create({
        title: 'Express',
        description: "Express.js is a minimal and flexible Node.js web application framework providing a robust set of features for building web applications."
    });

    const category4 = await Category.create({
        title: 'nodemailer',
        description: "Easy to use module to send e-mails with Node.js"
    });

    const category5 = await Category.create({
        title: 'React',
        description: "React is a JavaScript library for building user interfaces. It uses a declarative, component-based paradigm and aims to be efficient and flexible."
    });

    const category6 = await Category.create({
        title: 'C',
        description: "C is a general-purpose programming language used for system programming (OS and embedded), libraries, games and cross-platform. This tag should be used with general questions concerning the C language, as defined in the ISO 9899 standard."
    });

    const post1 = await Post.create({
        title: 'How do I use .toLocaleTimeString() without displaying seconds?',
        content: "I'm currently attempting to display the user's time without displaying the seconds. Is there a way I can do this using Javascript's .toLocaleTimeString()?\nDoing something like this:\nvar date = new Date();\nvar string = date.toLocaleTimeString();\nwill display the user's time with every unit, e.g. currently it displays 3:39:15 PM. Am I able to display that same string, just without the seconds? (e.g. 3:39 PM)",
        author: user2.id,
        status: 'active',
        publishDate: new Date(2022, 8, 28, 15, 32, 27)
    }); 
    
    await CategoryPost.create({
        categoryId: category1.id,
        postId: post1.id
    });

    const comment11 = await Comment.create({
        content: "You can always set the options to get rid of the seconds, something like this\nvar dateWithouthSecond = new Date();\ndateWithouthSecond.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});\nSupported by Firefox, Chrome, IE9+ and Opera. Try it on your web browser console.",
        author: user3.id,
        postId: post1.id,
        status: 'active',
        publishDate: new Date(2022, 8, 29, 14, 2, 39)
    }); 

    const comment12 = await Comment.create({
        content: "This works for me:\nvar date = new Date();\nvar string = date.toLocaleTimeString([], {timeStyle: 'short'});",
        author: user1.id,
        postId: post1.id,
        status: 'active',
        publishDate: new Date(2022, 8, 30, 18, 42, 15)
    });

    const post2 = await Post.create({
        title: "Difference between res.setHeader and res.header in node.js",
        content: "What is the difference between res.setHeader and res.header. Which one should be used for enabling CORS? In some pages res.header is used and some pages res.setHeader is used for CORS.",
        author: user3.id,
        status: 'active',
        publishDate: new Date(2022, 8, 29, 4, 23, 5)
    });

    await CategoryPost.create({
        categoryId: category2.id,
        postId: post2.id,
    });

    await CategoryPost.create({
        categoryId: category3.id,
        postId: post2.id,
    });

    const comment21 = await Comment.create({
        content: `Documentation: <a href="https://nodejs.org/api/http.html#http_response_setheader_name_value">res.setHeader()</a>, <a href="http://expressjs.com/en/api.html#res.set">res.set()</a>`,
        author: user2.id,
        postId: post2.id,
        status: 'active',
        publishDate: new Date(2022, 8, 29, 7, 27, 45)
    });

    const comment22 = await Comment.create({
        content: `res.setHeader() is a native method of Node.js and res.header() is an alias of res.set() method from Express framework. This two methods do exactly the same thing, set the headers HTTP response. The only difference is res.setHeader() allows you only to set a singular header and res.header() will allow you to set multiple headers. So use the one fit with your needs.`,
        author: user4.id,
        postId: post2.id,
        repliedCommentId: comment21.id,
        status: 'active',
        publishDate: new Date(2022, 8, 30, 18, 43, 26)
    });

    const post3 = await Post.create({
        title: "Nodemailer Incorrect authentication data",
        content: "I am writing a function for sending magic links to new users (on photo).And the code fails with this error.\nCredentials are 100% correct. Does anyone have any ideas about what might have gone wrong? I have tried all solutions possible both from stack overflow and github. And if I set port:2525 and secure: false I get Error: Greeting never received and greetingTimeout doesn't help.",
        author: user2.id,
        status: 'active',
        publishDate: new Date(2022, 9, 1, 15, 35, 55)
    });

    await ImageFromPost.create({
        picturePath: 'post31.png',
        postId: post3.id
    });

    await ImageFromPost.create({
        picturePath: 'post32.png',
        postId: post3.id
    });

    await CategoryPost.create({
        categoryId: category2.id,
        postId: post3.id
    });

    await CategoryPost.create({
        categoryId: category4.id,
        postId: post3.id
    });

    const comment31 = await Comment.create({
        content: `I think you missed type: 'LOGIN', in auth, try it.`,
        author: user1.id,
        postId: post3.id,
        status: 'active',
        publishDate: new Date(2022, 9, 1, 18, 5, 25)
    });

    const comment32 = await Comment.create({
        content: `Unacceptable content. Come up with your own`,
        author: user3.id,
        postId: post3.id,
        status: 'inactive',
        publishDate: new Date(2022, 9, 1, 22, 45, 22)
    });

    const post4 = await Post.create({
        title: "'Outlet' is not defined in react-router v6.4",
        content: "How Outlet Should be defined in react-router v6.4. Thank you.\nHere is my code",
        author: user1.id,
        status: 'active',
        publishDate: new Date(2022, 9, 3, 18, 23, 49)
    });

    await ImageFromPost.create({
        picturePath: 'post41.png',
        postId: post4.id
    });

    await CategoryPost.create({
        categoryId: category2.id,
        postId: post4.id
    });

    await CategoryPost.create({
        categoryId: category5.id,
        postId: post4.id
    });

    const comment41 = await Comment.create({
        content: `Import the values from the router and use the following structure.\nFollow the ReactRouter Documentation for more information`,
        author: user4.id,
        postId: post4.id,
        status: 'active',
        publishDate: new Date(2022, 9, 4, 15, 24, 45)
    });

    await ImageFromComment.create({
        picturePath: 'comment41.png',
        commentId: comment41.id
    });

    const post5 = await Post.create({
        title: "Сreating a working makefile",
        content: "Does anyone know how to create a working makefile? Tell me, please",
        author: user4.id,
        status: 'inactive',
        publishDate: new Date(2022, 9, 1, 12, 32, 53)
    });

    await CategoryPost.create({
        categoryId: category6.id,
        postId: post5.id
    });

    await FavoritesPost.bulkCreate([
        { userId: user1.id, postId: post2.id },
        { userId: user1.id, postId: post3.id },
        { userId: user3.id, postId: post5.id },
        { userId: user4.id, postId: post1.id },
        { userId: user4.id, postId: post2.id },
        { userId: user4.id, postId: post5.id }
    ]);

    await LikeForPost.bulkCreate([
        { author: user1.id, postId: post1.id, type: "like", publishDate: new Date(2022, 8, 28, 17, 8, 36) },
        { author: user1.id, postId: post5.id, type: "like", publishDate: new Date(2022, 9, 1, 17, 33, 23) },
        { author: user2.id, postId: post2.id, type: "dislike", publishDate: new Date(2022, 8, 29, 14, 29, 25) },
        { author: user2.id, postId: post4.id, type: "dislike", publishDate: new Date(2022, 9, 3, 20, 34, 34) },
        { author: user2.id, postId: post5.id, type: "like", publishDate: new Date(2022, 9, 5, 21, 23, 23) },
        { author: user3.id, postId: post1.id, type: "dislike", publishDate: new Date(2022, 9, 1, 4, 2, 8) },
        { author: user3.id, postId: post4.id, type: "like", publishDate: new Date(2022, 9, 4, 13, 34, 23) },
        { author: user4.id, postId: post2.id, type: "like", publishDate: new Date(2022, 9, 4, 13, 53, 54) },
        { author: user4.id, postId: post3.id, type: "dislike", publishDate: new Date(2022, 9, 2, 10, 45, 2) },
        { author: user4.id, postId: post4.id, type: "like", publishDate: new Date(2022, 9, 4, 17, 23, 43) }
    ]);

    await LikeForComment.bulkCreate([
        { author: user1.id, commentId: comment11.id, type: "dislike", publishDate: new Date(2022, 8, 30, 16, 37, 27) },
        { author: user1.id, commentId: comment32.id, type: "like", publishDate: new Date(2022, 9, 3, 16, 34, 12) },
        { author: user1.id, commentId: comment41.id, type: "like", publishDate: new Date(2022, 9, 5, 14, 43, 24) },
        { author: user2.id, commentId: comment12.id, type: "dislike", publishDate: new Date(2022, 9, 2, 13, 22, 21) },
        { author: user2.id, commentId: comment22.id, type: "dislike", publishDate: new Date(2022, 9, 4, 16, 43, 39) },
        { author: user2.id, commentId: comment41.id, type: "like", publishDate: new Date(2022, 9, 5, 22, 12, 34) },
        { author: user3.id, commentId: comment31.id, type: "like", publishDate: new Date(2022, 9, 3, 20, 15, 16) },
        { author: user3.id, commentId: comment41.id, type: "like", publishDate: new Date(2022, 9, 7, 21, 34, 54) },
        { author: user4.id, commentId: comment11.id, type: "like", publishDate: new Date(2022, 8, 30, 17, 39, 47) },
        { author: user4.id, commentId: comment12.id, type: "like", publishDate: new Date(2022, 9, 3, 15, 44, 38) },
        { author: user4.id, commentId: comment32.id, type: "dislike", publishDate: new Date(2022, 9, 5, 21, 91, 54) }
    ]);
}

module.exports = createTestData;

