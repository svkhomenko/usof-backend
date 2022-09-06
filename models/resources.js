const bcrypt  = require("bcrypt");
const db = require("./init.js");

const User = db.sequelize.models.user; 
const CategoryPost = db.sequelize.models.CategoryPost; 
const LikeForComment = db.sequelize.models.likeForComment; 

module.exports = [
    {
        resource: User,
        options: {
            listProperties: ['id', 'login', 'fullName', 'email', 'profilePicture', 'role'],
            actions: {
                new: {
                    before: hashPassword
                },
                edit: {
                    before: hashPassword
                }
            }
        }
    },
    {
        resource: CategoryPost,
        options: {
            listProperties: ['categoryId', 'postId'],
            properties: {
                categoryId: {
                    isVisible: { list: true, filter: true, show: true, edit: true }
                },
                postId: {
                    isVisible: { list: true, filter: true, show: true, edit: true }
                }
            },
            actions: {
                new: {
                    // before: function (request) {
                    //     if (request.payload.password) {
                    //         let salt = bcrypt.genSaltSync(10);
                    //         request.payload = {
                    //             ...request.payload,
                    //             password: await bcrypt.hash(request.payload.password, salt)
                    //         }
                    //     }
                    //     sequelize.models.CategoryPost.create({ categoryId: '1', postId: "1" });
                    // }
                },
                // edit: {
                //     before: hashPassword
                // }
            }
        }
    },
    {
        resource: LikeForComment,
        options: {
            listProperties: ['author', 'commentId', 'publishDate', 'type'],
            properties: {
                author: {
                    isVisible: { list: true, filter: true, show: true, edit: true }
                },
                commentId: {
                    isVisible: { list: true, filter: true, show: true, edit: true }
                }
            },
            actions: {
                new: {
                    after: async function (response) {
                        try {
                            await LikeForComment.create({
                                author: response.record.params.author,
                                commentId: response.record.params.commentId,
                                publishDate: response.record.params.publishDate,
                                type: response.record.params.type
                            });
                        }
                        catch(error) {
                            let message = 'There are validation errors - check them out below';
                            let record = response.record;
                            if (error.original && error.original.code === 'ER_DUP_ENTRY') {
                                message = 'PRIMARY must be unique';
                                record.errors = { PRIMARY: { message: 'PRIMARY must be unique', kind: 'not_unique' } };
                            }

                            return ({
                                ...response,
                                record: record,
                                notice: { message: message, type: 'error' }
                            });
                        }

                        return ({
                            ...response,
                            redirectUrl: '/admin/resources/likeForComments',
                            notice: { message: 'Successfully created a new record', type: 'success' }
                        });
                    }
                }
            }
        }
    }
];

async function hashPassword(request) {
    if (request.payload.password) {
        let salt = bcrypt.genSaltSync(10);
        request.payload = {
            ...request.payload,
            password: await bcrypt.hash(request.payload.password, salt)
        }
    }
    return request;
}
