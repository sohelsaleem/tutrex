const api = require('../api/makeApiRequest');

module.exports = {
    getList,
    isAvailable
};

function* getList(user, folderId) {
    const requestOptions = {
        relativeUrl: 'storage.list',
        method: 'get',
        parameters: {
            userId: user.id,
            folderId
        }
    };

    const result = yield api.makeApiRequest(requestOptions);

    const response = result.response;
    const body = result.body;

    if (response.statusCode !== 200)
        return [];

    return body.result;
}

function* isAvailable(user, itemId) {
    const requestOptions = {
        relativeUrl: 'storage.available',
        method: 'get',
        parameters: {
            userId: user.id,
            itemId
        }
    };

    const result = yield api.makeApiRequest(requestOptions);

    const response = result.response;
    const body = result.body;

    if (response.statusCode !== 200)
        return false;

    return body.result;
}