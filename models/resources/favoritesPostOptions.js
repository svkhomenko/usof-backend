const db = require("../init.js");

const FavoritesPost = db.sequelize.models.favoritesPost;

exports.options = {
    listProperties: ['userId', 'postId'],
    properties: {
        userId: {
            isVisible: { list: true, filter: true, show: true, edit: false }
        },
        postId: {
            isVisible: { list: true, filter: true, show: true, edit: true }
        }
    },
    actions: {
        new: {
            before: async (request, { currentAdmin }) => {
                request.payload = {
                    ...request.payload,
                    userId: currentAdmin.id
                };
                return request;
            },
            after: async function (response) {
                try {
                    await FavoritesPost.create({
                        userId: response.record.params.userId,
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
                    redirectUrl: '/admin/resources/favoritesPosts',
                    notice: { message: 'Successfully created a new record', type: 'success' }
                });
            }
        },
        edit: {
            isAccessible: false
        }
    }
};

