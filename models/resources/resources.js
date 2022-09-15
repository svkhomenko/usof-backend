const db = require("../init.js");
const userOptions = require('./userOptions');
const postOptions = require('./postOptions');
const imageFromPostOptions = require('./imageFromPostOptions');
const categoryPostOptions = require('./categoryPostOptions');
const commentOptions = require('./commentOptions');
const likeForPostOptions = require('./likeForPostOptions');
const likeForCommentOptions = require('./likeForCommentOptions');

const User = db.sequelize.models.user; 
const Post = db.sequelize.models.post; 
const ImageFromPost = db.sequelize.models.imageFromPost;
const Category = db.sequelize.models.category; 
const CategoryPost = db.sequelize.models.categoryPost; 
const Comment = db.sequelize.models.comment; 
const LikeForPost = db.sequelize.models.likeForPost;
const LikeForComment = db.sequelize.models.likeForComment; 

module.exports = [
    {
        resource: User,
        options: userOptions.options,
        features: userOptions.features
    },
    {
        resource: Post,
        options: postOptions.options
    },
    {
        resource: ImageFromPost,
        options: imageFromPostOptions.options,
        features: imageFromPostOptions.features
    },
    {
        resource: Category,
        options: {
            listProperties: ['id', 'title', 'description']
        }
    },
    {
        resource: CategoryPost,
        options: categoryPostOptions.options 
    },
    {
        resource: Comment,
        options: commentOptions.options 
    },
    {
        resource: LikeForPost,
        options: likeForPostOptions.options 
    },
    {
        resource: LikeForComment,
        options: likeForCommentOptions.options
    }
];




// module.exports = [
//     {
//         resource: User,
//         options: {
//             listProperties: ['id', 'login', 'fullName', 'email', 'profilePicture', 'role'],
//             // listProperties: ['id', 'login', 'fullName', 'email', 'profilePicture', 'rating', 'role'],
//             properties: {
//                 email: {
//                     isTitle: false
//                 },
//                 login: {
//                     isTitle: true
//                 },
//                 encryptedPassword: {
//                     isVisible: { list: false, filter: false, show: false, edit: false }
//                 },
//                 picturePath: {
//                     isVisible: { list: false, filter: false, show: false, edit: false }
//                 },
//                 rating: {
//                     isVisible: { list: true, filter: true, show: true, edit: false }
//                 },
//                 profilePicture: {
//                     isVisible: { list: true, filter: false, show: true, edit: true },
//                     components: {
//                         show: AdminJS.bundle('../components/avatar_show.js'),
//                         list: AdminJS.bundle('../components/avatar_list.js')
//                     }
//                 }
//             },
//             actions: {
//                 new: {
//                     before: validatePassword
//                 },
//                 edit: {
//                     before: validatePassword
//                 }
//             },
//             // actions: {
//             //     new: {
//             //         before(r) {
//             //             console.log('before');
//             //             return r;
//             //         },
//             //         after(r) {
//             //             console.log('after');
//             //             return r;
//             //         }
//             //     },
//             //     edit: {
//             //         before(r) {
//             //             console.log('before', r);
//             //             return r;
//             //         },
//             //         after(r) {
//             //             console.log('after');
//             //             return r;
//             //         }
//             //     }
//             // }
//         },
//         features: [
//             uploadFeature({
//                 provider: new UploadProvider(),
//                 properties: {
//                     file: 'profilePicture',
//                     key: 'picturePath', 
//                     mimeType: 'mimeType'
//                 },
//                 validation: {
//                     mimeTypes: ['image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/tiff', 'image/webp']
//                 },
//                 uploadPath: (record, filename) => {
//                     // console.log('uploadPath', record, filename);
//                     return `${record.id()}${Date.now()}-${filename}`;
//                 }
//             }),
//             passwordFeature({
//                 properties: {
//                     encryptedPassword: 'encryptedPassword'
//                 },
//                 hash: hashPassword
//             })
//         ]
//     },
//     {
//         resource: Post,
//         options: {
//             listProperties: ['id', 'author', 'title', 'publishDate', 'status', 'content'],
//             properties: {
//                 author: {
//                     isVisible: { list: true, filter: true, show: true, edit: false }
//                 },
//                 title: {
//                     description: 'Only owner can edit this field'
//                 },
//                 content: {
//                     description: 'Only owner can edit this field'
//                 }
//             },
//             actions: {
//                 new: {
//                     before: async (request, { currentAdmin }) => {
//                         request.payload = {
//                             ...request.payload,
//                             author: currentAdmin.id
//                         };
//                         return request;
//                     }
//                 },
//                 edit: {
//                     before: async (request, { currentAdmin }) => {
//                         if (request.method === 'post' && request.payload.author != currentAdmin.id) {
//                             request.payload = {
//                                 ...request.payload,
//                                 title: undefined,
//                                 content: undefined
//                             };
//                         }
//                         return request;
//                     }
//                 }
//             }
//         }
//     },
//     {
//         resource: ImageFromPost,
//         options: {
//             listProperties: ['id', 'postId', 'image'],
//             properties: {
//                 picturePath: {
//                     isVisible: { list: false, filter: false, show: false, edit: false }
//                 },
//                 image: {
//                     isVisible: { list: true, filter: false, show: true, edit: true },
//                     components: {
//                         show: AdminJS.bundle('../../components/avatar_show.js'),
//                         list: AdminJS.bundle('../../components/avatar_list.js')
//                     }
//                 }
//             }
//         },
//         features: [
//             uploadFeature({
//                 provider: new UploadProvider(),
//                 properties: {
//                     file: 'image',
//                     key: 'picturePath', 
//                     mimeType: 'mimeType' 
//                 },
//                 validation: {
//                     mimeTypes: ['image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/tiff', 'image/webp']
//                 },
//                 uploadPath: (record, filename) => {
//                     console.log('uploadPath', record, filename);
//                     return `${record.id()}${Date.now()}-posts-${filename}`;
//                 }
//             })
//         ]
//     },
//     {
//         resource: Category,
//         options: {
//             listProperties: ['id', 'title', 'description']
//         }
//     },
//     {
//         resource: CategoryPost,
//         options: {
//             listProperties: ['categoryId', 'postId'],
//             properties: {
//                 categoryId: {
//                     isVisible: { list: true, filter: true, show: true, edit: true }
//                 },
//                 postId: {
//                     isVisible: { list: true, filter: true, show: true, edit: true }
//                 }
//             },
//             actions: {
//                 new: {
//                     after: async function (response) {
//                         try {
//                             await CategoryPost.create({
//                                 categoryId: response.record.params.categoryId,
//                                 postId: response.record.params.postId
//                             });
//                         }
//                         catch(error) {
//                             let message = 'There are validation errors - check them out below';
//                             let record = response.record;
//                             if (error.original && error.original.code === 'ER_DUP_ENTRY') {
//                                 message = 'PRIMARY must be unique';
//                                 record.errors = { PRIMARY: { message: 'PRIMARY must be unique', kind: 'not_unique' } };
//                             }

//                             return ({
//                                 ...response,
//                                 record: record,
//                                 notice: { message: message, type: 'error' }
//                             });
//                         }

//                         return ({
//                             ...response,
//                             redirectUrl: '/admin/resources/categoryPosts',
//                             notice: { message: 'Successfully created a new record', type: 'success' }
//                         });
//                     }
//                 }
//             }
//         }
//     },
//     {
//         resource: LikeForPost,
//         options: {
//             listProperties: ['author', 'postId', 'publishDate', 'type'],
//             properties: {
//                 author: {
//                     isVisible: { list: true, filter: true, show: true, edit: true }
//                 },
//                 postId: {
//                     isVisible: { list: true, filter: true, show: true, edit: true }
//                 }
//             },
//             actions: {
//                 new: {
//                     after: async function (response) {
//                         try {
//                             await LikeForPost.create({
//                                 author: response.record.params.author,
//                                 postId: response.record.params.postId,
//                                 publishDate: response.record.params.publishDate,
//                                 type: response.record.params.type
//                             });
//                         }
//                         catch(error) {
//                             let message = 'There are validation errors - check them out below';
//                             let record = response.record;
//                             if (error.original && error.original.code === 'ER_DUP_ENTRY') {
//                                 message = 'PRIMARY must be unique';
//                                 record.errors = { PRIMARY: { message: 'PRIMARY must be unique', kind: 'not_unique' } };
//                             }

//                             return ({
//                                 ...response,
//                                 record: record,
//                                 notice: { message: message, type: 'error' }
//                             });
//                         }

//                         return ({
//                             ...response,
//                             redirectUrl: '/admin/resources/likeForPosts',
//                             notice: { message: 'Successfully created a new record', type: 'success' }
//                         });
//                     }
//                 }
//             }
//         }
//     },
//     {
//         resource: LikeForComment,
//         options: {
//             listProperties: ['author', 'commentId', 'publishDate', 'type'],
//             properties: {
//                 author: {
//                     isVisible: { list: true, filter: true, show: true, edit: true }
//                 },
//                 commentId: {
//                     isVisible: { list: true, filter: true, show: true, edit: true }
//                 }
//             },
//             actions: {
//                 new: {
//                     after: async function (response) {
//                         try {
//                             await LikeForComment.create({
//                                 author: response.record.params.author,
//                                 commentId: response.record.params.commentId,
//                                 publishDate: response.record.params.publishDate,
//                                 type: response.record.params.type
//                             });
//                         }
//                         catch(error) {
//                             let message = 'There are validation errors - check them out below';
//                             let record = response.record;
//                             if (error.original && error.original.code === 'ER_DUP_ENTRY') {
//                                 message = 'PRIMARY must be unique';
//                                 record.errors = { PRIMARY: { message: 'PRIMARY must be unique', kind: 'not_unique' } };
//                             }

//                             return ({
//                                 ...response,
//                                 record: record,
//                                 notice: { message: message, type: 'error' }
//                             });
//                         }

//                         return ({
//                             ...response,
//                             redirectUrl: '/admin/resources/likeForComments',
//                             notice: { message: 'Successfully created a new record', type: 'success' }
//                         });
//                     }
//                 }
//             }
//         }
//     }
// ];

