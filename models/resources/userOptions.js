const AdminJS = require('adminjs');
const uploadFeature = require('@adminjs/upload');
const passwordFeature = require('@adminjs/passwords');
const { ValidationError } = require('adminjs');
const bcrypt  = require("bcrypt");

const UploadProvider = require('./UploadProvider');

exports.options = {
    listProperties: ['id', 'login', 'fullName', 'email', 'profilePicture', 'rating', 'role', 'status'],
    properties: {
        email: {
            isTitle: false
        },
        login: {
            isTitle: true
        },
        encryptedPassword: {
            isVisible: { list: false, filter: false, show: false, edit: false }
        },
        picturePath: {
            isVisible: { list: false, filter: false, show: false, edit: false }
        },
        rating: {
            isVisible: { list: true, filter: false, show: true, edit: false },
            components: {
                show: AdminJS.bundle('../../components/rating_show.js'),
                list: AdminJS.bundle('../../components/rating_list.js')
            }
        },
        status: {
            isVisible: { list: true, filter: true, show: true, edit: false }
        },
        profilePicture: {
            isVisible: { list: true, filter: false, show: true, edit: true },
            components: {
                show: AdminJS.bundle('../../components/avatar_show.js'),
                list: AdminJS.bundle('../../components/avatar_list.js')
            }
        }
    },
    actions: {
        new: {
            before: validatePassword
        },
        edit: {
            before: validatePassword
        }
    }
};

exports.features = [
    uploadFeature({
        provider: new UploadProvider(),
        properties: {
            file: 'profilePicture',
            key: 'picturePath', 
            mimeType: 'mimeType'
        },
        validation: {
            mimeTypes: ['image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/tiff', 'image/webp']
        },
        uploadPath: (record, filename) => {
            return `${record.id()}${Date.now()}-${filename}`;
        }
    }),
    passwordFeature({
        properties: {
            encryptedPassword: 'encryptedPassword'
        },
        hash: hashPassword
    })
];

function hashPassword(password) {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

async function validatePassword(request) {
    const password = request.fields.password;
    const encryptedPassword = request.payload.encryptedPassword;

    if (request.method !== 'post' || (password == undefined && encryptedPassword)) {
        return request;
    }

    if (!/^[a-zA-Z0-9]+$/.test(password)) {
        throw new ValidationError({
            password: {
                message: "Password must containt only a-z, A-Z, 0-9"
            },
        }, {
            message: 'There are validation errors - check them out below'
        });
    }
    else if (!/(?=.*\d)/.test(password)) {
        throw new ValidationError({
            password: {
                message: "Password must containt at least one digit"
            },
        }, {
            message: 'There are validation errors - check them out below'
        });
    }
    else if (!/(?=.*[a-z])/.test(password)) {
        throw new ValidationError({
            password: {
                message: "Password must containt at least one lowercase letter"
            },
        }, {
            message: 'There are validation errors - check them out below'
        });
    }
    else if (!/(?=.*[A-Z])/.test(password)) {
        throw new ValidationError({
            password: {
                message: "Password must containt at least one uppercase letter"
            },
        }, {
            message: 'There are validation errors - check them out below'
        });
    }

    return request;
}

