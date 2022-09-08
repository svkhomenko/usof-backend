const AdminJS = require('adminjs');
const uploadFeature = require('@adminjs/upload');
const { BaseProvider } = require('@adminjs/upload');
const fs = require("fs");
const { move } = require("fs-extra");
const path = require("path");
const db = require("./init.js");

const User = db.sequelize.models.user; 
const CategoryPost = db.sequelize.models.CategoryPost; 
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

    async delete(key, bucket) {
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
                    mimeType: 'mimeType' 
                },
                validation: {
                    mimeTypes: ['image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/tiff', 'image/webp']
                }
            })
        ]
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
    console.log("request", request.payload);
    // if (request.payload.password) {
    //     let salt = bcrypt.genSaltSync(10);
    //     request.payload = {
    //         ...request.payload,
    //         password: await bcrypt.hash(request.payload.password, salt)
    //     }
    // }
    return request;
}
