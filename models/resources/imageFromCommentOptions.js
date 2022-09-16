const AdminJS = require('adminjs');
const uploadFeature = require('@adminjs/upload');
const { ValidationError } = require('adminjs');

const db = require("../init.js");
const User = db.sequelize.models.user; 
const Comment = db.sequelize.models.comment; 
const UploadProvider = require('./UploadProvider');

exports.options = {
    listProperties: ['id', 'commentId', 'image'],
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
            return `${record.id()}${Date.now()}-comments-${filename}`;
        }
    })
];

async function validate(request, { currentAdmin }) {
    if (request.method !== 'post') {
        return request;
    }
    
    const commentId = request.payload.commentId;
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
    
    if (commentId) {
        const comment = await Comment.findOne({
            where: {
                id: commentId
            },
            include: {
                model: User,
                as: 'commentAuthor'
            }
        });

        if (comment && comment.commentAuthor && comment.commentAuthor.id !== currentAdmin.id) {
            throw new ValidationError({
                commentId: {
                    message: "You can add image only to your own comments"
                },
            }, {
                message: 'There are validation errors - check them out below'
            });
        }
    }

    return request;
}

function canEdit({ currentAdmin, record }) {
    if (record.populated.commentId && record.populated.commentId.params.author !== currentAdmin.id) {
        return false;
    }

    return true;
}

