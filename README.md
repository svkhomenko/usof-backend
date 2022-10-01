# Usof backend

An API for a future question and answer service for professional and enthusiast programmers - usof. It allows you to share your problems/solutions with short posts and receivesolutions/feedback, or even increase your profile rating. 

## Installation

1. Clone project 
    ```sh
    git clone git@gitlab.ucode.world:connect-khpi/connect-fullstack-usof-backend/skhomenko.git
    ```
2. In the root of project run
    ```sh
    npm install
    ```
3. Create database
    for Linux
    ```sh
    mysql -u root -p < db_init.sql
    ```
    for Windows in MySQL Shell
    ```sh
    source <path_for_root_of_project>\db_init.sql
    ```
4. Run the server
    ```sh
    node index.js
    ```

*The app has been tested on Windows. Linux may require additional settings*

## Tech

Usof backend uses a number of open source projects to work properly:

- [Node.js](https://nodejs.org/en/) - evented I/O for the backend
- [Express](https://expressjs.com/) - fast node.js network app framework 
- [AdminJS](https://docs.adminjs.co/) - an open-source admin panel for your Node.js application
- [MySQL](https://www.mysql.com/) - open-source relational database management system 
- [Sequelize](https://sequelize.org/) - modern TypeScript and Node.js ORM for Oracle, Postgres, MySQL, MariaDB, SQLite and SQL Server, and more
- [Nodemailer](https://nodemailer.com/about/) - module for Node.js applications to allow easy as cake email sending
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - implementation of JSON Web Tokens
- [bcrypt](https://www.npmjs.com/package/bcrypt) - library to help you hash passwords
- [Multer](https://www.npmjs.com/package/multer) - node.js middleware for handling multipart/form-data, which is primarily used for uploading files
- [cors](https://www.npmjs.com/package/cors) - node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options

## Admin panel

Admin panel is available at http://localhost:3000/admin/login. For admins only

## Endpoints

**Authorization**
| Method | Endpoint | Description | Parameters |
| :- | :- | :- | :- |
| **POST** | `/api/auth/register` | Registration of a new user | login, password, passwordConfirmation, email, fullName, link (for client confirmation page, replace 'dot' with '.') |
| **POST** | `/api/auth/email-confirmation/:confirm_token` | Confirmation of your email with a token from email |
| **POST** | `/api/auth/login` | Log in user. Only users with a confirmed email can sign in | login, password, link (for new email confirmation, replace 'dot' with '.') |
| **POST** | `/api/auth/logout` | Log out authorized user |
| **POST** | `/api/auth/password-reset` | Send a reset link to user email | email, link (for client confirmation page, replace 'dot' with '.') |
| **POST** | `/api/auth/password-reset/:confirm_token` | Confirmation of new password with a token from email | newPassword |

**User**
| Method | Endpoint | Description | Parameters |
| :- | :- | :- | :- |
| **GET** | `/api/users` | Get all users | |
| **GET** | `/api/users/:user_id` | Get specified user data | |
| **POST** | `/api/users` | Create a new user. Only for admins | login, password, passwordConfirmation, email, fullName, role, link (for client confirmation page, replace 'dot' with '.') |
| **PATCH** | `/api/users/avatar` | Upload user avatar | avatar |
| **PATCH** | `/api/users/:user_id` | Update user data | email, login, fullName, role, avatar, deleteAvatar (boolean), link (for client confirmation page, replace 'dot' with '.') |
| **DELETE** | `/api/users/:user_id` | Delete user | |

**Posts**
| Method | Endpoint | Description | Parameters |
| :- | :- | :- | :- |
| **GET** | `/api/posts` | Get all posts. Pagination is implemented | page (starts with 1), orderBy (date), filterStatus (active, inactive) (separated by commas), search, filterCategory (separated by commas), filterDate (from...to) |
| **GET** | `/api/posts/own-posts` | Get own posts. Pagination is implemented | page (starts with 1), orderBy (date), filterStatus (active, inactive) (separated by commas), search, filterCategory (separated by commas), filterDate (from...to) |
| **GET** | `/api/posts/favorites` | Get favorites posts. Pagination is implemented | page (starts with 1), orderBy (date), filterStatus (active, inactive) (separated by commas), search, filterCategory (separated by commas), filterDate (from...to) |
| **GET** | `/api/posts/:post_id` | Get specified post data | |
| **GET** | `/api/posts/:post_id/comments` | Get all comments for the specified post | |
| **POST** | `/api/posts/:post_id/comments` | Create a new comment | content, repliedCommentId, commentImages |
| **GET** | `/api/posts/:post_id/categories` | Get all categories associated with the specified post | |
| **GET** | `/api/posts/:post_id/like` | Get all likes under the specified post. Pagination is implemented | page (starts with 1) |
| **POST** | `/api/posts/` | Create a new post | title, content, categories (array), postImages |
| **POST** | `/api/posts/:post_id/like` | Create a new like/dislike under a post | type |
| **POST** | `/api/posts/:post_id/favorites` | Update favorites for a post | |
| **PATCH** | `/api/posts/:post_id` | Update the specified post | title, content, categories (array), status (active, inactive), deleteFiles (array of id), postImages |
| **DELETE** | `/api/posts/:post_id` | Delete a post | |
| **DELETE** | `/api/posts/:post_id/like` | Delete like/dislike under a post | |

**Category**
| Method | Endpoint | Description | Parameters |
| :- | :- | :- | :- |
| **GET** | `/api/categories` | Get all categories. Pagination is implemented | page (starts with 1), search |
| **GET** | `/api/categories/:category_id` | Get specified category data | |
| **GET** | `/api/categories/:category_id/posts` | Get all posts associated with the specified category. Pagination is implemented | page (starts with 1), orderBy (date), filterStatus (active, inactive) (separated by commas), search, filterCategory (separated by commas), filterDate (from...to) |
| **POST** | `/api/categories` | Create a new category | title, description |
| **PATCH** | `/api/categories/:category_id` | Update specified category data | title, description |
| **DELETE** | `/api/categories/:category_id` | Delete a category | |

**Comments**
| Method | Endpoint | Description | Parameters |
| :- | :- | :- | :- |
| **GET** | `/api/comments/:comment_id` | Get specified comment data | |
| **GET** | `/api/comments/:comment_id/like` | Get all likes under the specified comment. Pagination is implemented | page (starts with 1)
| **POST** | `/api/comments/:comment_id/like` | Create a new like/dislike under a comment | type |
| **PATCH** | `/api/comments/:comment_id` | Update specified comment data | content, status, deleteFiles (array), commentImages |
| **DELETE** | `/api/comments/:comment_id` | Delete a comment |
| **DELETE** | `/api/comments/:comment_id/like` | Delete a like/dislike under a comment |

*Send token for authorization into Authorization request header*

