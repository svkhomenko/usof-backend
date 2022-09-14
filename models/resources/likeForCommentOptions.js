const db = require("../init.js");

const LikeForComment = db.sequelize.models.likeForComment; 

exports.options = {
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
};

