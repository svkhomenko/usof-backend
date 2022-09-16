exports.options = {
    listProperties: ['id', 'content', 'postId', 'repliedCommentId', 'author', 'status', 'publishDate'],
    properties: {
        id: {
            isTitle: false
        },
        author: {
            isVisible: { list: true, filter: true, show: true, edit: false }
        },
        content: {
            isTitle: true,
            description: 'Only owner can edit this field'
        }
    },
    actions: {
        new: {
            before: async (request, { currentAdmin }) => {
                request.payload = {
                    ...request.payload,
                    author: currentAdmin.id
                };
                return request;
            }
        },
        edit: {
            before: async (request, { currentAdmin }) => {
                if (request.method === 'post' && request.payload.author != currentAdmin.id) {
                    request.payload = {
                        ...request.payload,
                        content: undefined
                    };
                }
                return request;
            }
        }
    }
};

