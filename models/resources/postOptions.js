exports.options = {
    listProperties: ['id', 'author', 'title', 'publishDate', 'status', 'content'],
    properties: {
        author: {
            isVisible: { list: true, filter: true, show: true, edit: false }
        },
        title: {
            description: 'Only owner can edit this field'
        },
        content: {
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
                        title: undefined,
                        content: undefined
                    };
                }
                return request;
            }
        }
    }
};

