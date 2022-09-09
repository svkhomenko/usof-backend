const AdminJS = require('adminjs');
const uploadFeature = require('@adminjs/upload');
const { BaseProvider } = require('@adminjs/upload');
const fs = require("fs");
const { move } = require("fs-extra");
const path = require("path");
const db = require("./init.js");

const User = db.sequelize.models.user; 
const Post = db.sequelize.models.post; 
const ImageFromPost = db.sequelize.models.imageFromPost;
const Category = db.sequelize.models.category; 
const CategoryPost = db.sequelize.models.categoryPost; 
const LikeForPost = db.sequelize.models.likeForPost;
const LikeForComment = db.sequelize.models.likeForComment; 

class UploadProvider extends BaseProvider {
    constructor() {
        super('uploads');
    }

    async upload(file, key) {
        // console.log('upload', file, key);
        const filePath = process.platform === "win32" ? this.path(key) : this.path(key).slice(1); 
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        await move(file.path, filePath, { overwrite: true });
    }

    delete(key, bucket) {
        // console.log('delete', key, bucket);
    }

    path(key, bucket) {
        // console.log('path', key, bucket);
        return process.platform === "win32"
        ? `${path.join(bucket || this.bucket, key)}`
        : `/${path.join(bucket || this.bucket, key)}`;
    }
}

module.exports = [
    {
        resource: User,
        options: {
            listProperties: ['id', 'login', 'fullName', 'email', 'profilePicture', 'rating', 'role'],
            // actions: {
            //     new: {
            //         before: hashPassword
            //     },
            //     edit: {
            //         before: hashPassword
            //     }
            // },
            properties: {
                email: {
                    isTitle: false
                },
                login: {
                    isTitle: true
                },
                picturePath: {
                    isVisible: { list: false, filter: false, show: false, edit: false }
                },
                rating: {
                    isVisible: { list: true, filter: true, show: true, edit: false }
                },
                profilePicture: {
                    isVisible: { list: true, filter: false, show: true, edit: true },
                    components: {
                        show: AdminJS.bundle('../components/avatar_show.js'),
                        list: AdminJS.bundle('../components/avatar_list.js')
                    }
                }
            }
        },
        features: [
            uploadFeature({
                provider: new UploadProvider(),
                properties: {
                    file: 'profilePicture',
                    key: 'picturePath', 
                    mimeType: 'mimeType',
                    // uploadPath: function (record, filename) {
                    //     // console.log('uploadPath', record, filename);
                    //     // return `${record.id()}/${filename}`;
                    //     return 'ee';
                    // }
                },
                validation: {
                    mimeTypes: ['image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/tiff', 'image/webp']
                }
            })
        ]
    },
    {
        resource: Post,
        options: {
            listProperties: ['id', 'author', 'title', 'publishDate', 'status', 'content']
        }
    },
    {
        resource: ImageFromPost,
        options: {
            listProperties: ['id', 'postId', 'image'],
            properties: {
                picturePath: {
                    isVisible: { list: false, filter: false, show: false, edit: false }
                },
                image: {
                    isVisible: { list: true, filter: false, show: true, edit: true },
                    components: {
                        show: AdminJS.bundle('../components/avatar_show.js'),
                        list: AdminJS.bundle('../components/avatar_list.js')
                    }
                }
            }
        },
        // actions: {
        //     new: {
        //         before: hashPassword
        //     },
        //     edit: {
        //         before: hashPassword
        //     }
        // },
        // actions: {
        //     edit: {
        //         before: async function (response) {
        //             console.log(response);
        //             return response;
        //             // try {
        //             //     await LikeForPost.create({
        //             //         author: response.record.params.author,
        //             //         postId: response.record.params.postId,
        //             //         publishDate: response.record.params.publishDate,
        //             //         type: response.record.params.type
        //             //     });
        //             // }
        //             // catch(error) {
        //             //     let message = 'There are validation errors - check them out below';
        //             //     let record = response.record;
        //             //     if (error.original && error.original.code === 'ER_DUP_ENTRY') {
        //             //         message = 'PRIMARY must be unique';
        //             //         record.errors = { PRIMARY: { message: 'PRIMARY must be unique', kind: 'not_unique' } };
        //             //     }

        //             //     return ({
        //             //         ...response,
        //             //         record: record,
        //             //         notice: { message: message, type: 'error' }
        //             //     });
        //             // }

        //             // return ({
        //             //     ...response,
        //             //     redirectUrl: '/admin/resources/likeForPosts',
        //             //     notice: { message: 'Successfully created a new record', type: 'success' }
        //             // });
        //         }
        //     }
        // },
        features: [
            uploadFeature({
                provider: new UploadProvider(),
                properties: {
                    file: 'image',
                    key: 'picturePath', 
                    mimeType: 'mimeType' 
                },
                validation: {
                    mimeTypes: ['image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/tiff', 'image/webp']
                }
            })
        ]
    },
    {
        resource: Category,
        options: {
            listProperties: ['id', 'title', 'description']
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
                    after: async function (response) {
                        try {
                            await CategoryPost.create({
                                categoryId: response.record.params.categoryId,
                                postId: response.record.params.postId
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
                            redirectUrl: '/admin/resources/categoryPosts',
                            notice: { message: 'Successfully created a new record', type: 'success' }
                        });
                    }
                }
            }
        }
    },
    {
        resource: LikeForPost,
        options: {
            listProperties: ['author', 'postId', 'publishDate', 'type'],
            properties: {
                author: {
                    isVisible: { list: true, filter: true, show: true, edit: true }
                },
                postId: {
                    isVisible: { list: true, filter: true, show: true, edit: true }
                }
            },
            actions: {
                new: {
                    after: async function (response) {
                        try {
                            await LikeForPost.create({
                                author: response.record.params.author,
                                postId: response.record.params.postId,
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
                            redirectUrl: '/admin/resources/likeForPosts',
                            notice: { message: 'Successfully created a new record', type: 'success' }
                        });
                    }
                }
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
    // console.log("request", request.fields, request.payload, request.files);
    // console.log(request.files['profilePicture.0']);

    // request.fields.profilePicture = null;

    if (!request.files[0]) {
        request.files[0] = {
            path: path.resolve("uploads", '1.png'),
            name: '1.png',
            type: 'image/png',
        };
    }


    // const filePath = path.resolve("uploads", 'avatar.png');
    // fs.stat(filePath, function(err, stats) {
    //     if (err) {
    //         console.log('stat err', err);
    //     }
    //     else {
    //         console.log('stat', stats);
    //     }
    // });
    
    // const fileData = new LocalFileData(filePath);
    // console.log(constructFileFromLocalFileData(fileData));

    // if (request.files)
    // if (request.payload.password) {
    //     let salt = bcrypt.genSaltSync(10);
    //     request.payload = {
    //         ...request.payload,
    //         password: await bcrypt.hash(request.payload.password, salt)
    //     }
    // }
    return request;
}

