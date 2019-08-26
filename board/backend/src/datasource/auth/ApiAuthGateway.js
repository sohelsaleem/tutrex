'use strict';

const api = require('../api/makeApiRequest');

module.exports = function*(token) {
    try {
        return yield tryAuth(token);
    }
    catch (e) {
        logger.debug(e);
        return null;
    }
};

function* tryAuth(token) {
    const requestOptions = {
        relativeUrl:   'user.get-info',
        method: 'get',
        parameters: {token}
    };

    const result = yield api.makeApiRequest(requestOptions);
    const response = result.response;
    const body = result.body;

    if (response.statusCode !== 200)
        throw new Error('Auth server has responsed with code ' + response.statusCode);

    return body.result;
}
