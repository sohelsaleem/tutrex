'use strict';

const UserHelper = require('./helpers/UserHelper');

module.exports = function (listenMessage) {
    listenMessage('textChat:message:create', createTextChatMessage);
    listenMessage('textChat:message:history', getTextChatMessageHistory);
};

function* createTextChatMessage(client, message) {
    const textChatItem = message.textChatItem;

    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const textChatHistory = room.getTextChatHistory();
    textChatHistory.addChatItem(textChatItem, user);
}

function* getTextChatMessageHistory(client, message, responseChannel) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const textChatHistory = room.getTextChatHistory();
    const textChatItemList = textChatHistory.getChatItemList(user);

    responseChannel.sendAnswer(textChatItemList);
}
