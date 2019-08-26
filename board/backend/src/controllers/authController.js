'use strict';

const authService = require('../domain/room/AuthService');
const UserHelper = require('./helpers/UserHelper');

module.exports = function (listenMessage) {
    listenMessage('room:login', login);
    listenMessage('room:syncTime', syncTime);
};

function* login(client, message, responseChannel) {
    const token = message.token;
    const tabId = message.tabId;

    logger.debug('User joining with tabId', tabId);

    const authInfo = yield authOnServer(token, tabId);

    if (!authInfo)
        return sendUnauthorized(responseChannel);

    const userHelper = UserHelper(client);

    const responseFromLogin = client.login(authInfo.user, authInfo.room);
    if (!responseFromLogin.result) {
        return sendErrorMessageFromLogin(responseChannel, responseFromLogin.errorMessage);
    }

    logger.debug('User joined with auth info', JSON.stringify(authInfo));

    const room = userHelper.getRoom();
    const user = room.getUser(authInfo.user.id);

    responseChannel.sendAnswer({
        user,
        room: room.toDto()
    });
}

function* syncTime(client, message, responseChannel) {
    const now = Math.floor(new Date().getTime() / 1000);
    responseChannel.sendAnswer({
        time: now
    });
}

function* authOnServer(token, tabId) {
    return yield authService.auth(token, tabId);
}

function sendUnauthorized(responseChannel) {
    sendErrorMessageFromLogin(responseChannel, 'Bad token or user was dropped or user is already here');
}

function sendErrorMessageFromLogin(responseChannel, errorMessage){
    responseChannel.sendError(401, new Error(errorMessage));
}
