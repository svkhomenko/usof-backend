const AdminJS = require('adminjs');
const uploadFeature = require('@adminjs/upload');
const { ValidationError } = require('adminjs');

const db = require("../init.js");
const User = db.sequelize.models.user; 
const Post = db.sequelize.models.post; 
const UploadProvider = require('./UploadProvider');

exports.options = {
    listProperties: ['id', 'postId', 'image'],
    properties: {
        picturePath: {
            isVisible: { list: false, filter: false, show: false, edit: false }
        },
        image: {
            isVisible: { list: true, filter: false, show: true, edit: true },
            components: {
                show: AdminJS.bundle('../../components/avatar_show.js'),
                list: AdminJS.bundle('../../components/avatar_list.js')
            }
        }
    },
    actions: {
        new: {
            before: validate
        },
        edit: {
            before: validate,
            isAccessible: canEdit
        }
    }
};

exports.features = [
    uploadFeature({
        provider: new UploadProvider(),
        properties: {
            file: 'image',
            key: 'picturePath', 
            mimeType: 'mimeType' 
        },
        validation: {
            mimeTypes: ['image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/tiff', 'image/webp']
        },
        uploadPath: (record, filename) => {
            return `${record.id()}${Date.now()}-posts-${filename}`;
        }
    })
];

async function validate(request, { currentAdmin }) {
    if (request.method !== 'post') {
        return request;
    }
    
    const postId = request.payload.postId;
    const imageError = new ValidationError({
        image: {
            message: "You have to add image"
        }
    }, {
        message: 'You have to add image'
    });

    if (request.params.action === 'new') {
        if (!request.files['image.0'] && (!request.fields.image || request.fields.image === '__FORM_VALUE_EMPTY_ARRAY__')) {
            throw imageError;
        }
    }
    else if (request.params.action === 'edit') {
        if (!request.files['image.0'] && request.fields.image === '__FORM_VALUE_NULL__') {
            throw imageError;
        }
    }
    
    if (postId) {
        const post = await Post.findOne({
            where: {
                id: postId
            },
            include: {
                model: User,
                as: 'postAuthor'
            }
        });

        if (post && post.postAuthor && post.postAuthor.id !== currentAdmin.id) {
            throw new ValidationError({
                postId: {
                    message: "You can add image only to your own posts"
                },
            }, {
                message: 'There are validation errors - check them out below'
            });
        }
    }

    return request;
}

function canEdit({ currentAdmin, record }) {
    if (record.populated.postId && record.populated.postId.params.author !== currentAdmin.id) {
        return false;
    }

    return true;
}

