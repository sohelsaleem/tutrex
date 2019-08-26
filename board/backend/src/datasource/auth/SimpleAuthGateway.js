'use strict';

module.exports = function*(token) {
    try {
        return yield tryParseToken(token);
    } catch (e) {
        console.error(e, token);
        return null;
    }
};

function* tryParseToken(token) {
    yield simulateDelay();

    const json = new Buffer(token, 'base64').toString('utf8');
    const authInfo = JSON.parse(json);
    return authInfo;
}

function* simulateDelay() {
    const delay = config.simpleAuthDelay || 0;
    return new Promise(resolve => setTimeout(resolve, delay));
}
