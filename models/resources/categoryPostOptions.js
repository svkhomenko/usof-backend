const db = require("../init.js");

const CategoryPost = db.sequelize.models.categoryPost; 

exports.options = {
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
};

