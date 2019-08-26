'use strict';

const UserHelper = require('./helpers/UserHelper');

module.exports = function (listenMessage) {
    listenMessage('room:mode:toggle', toggleBetweenWebinarOrPresentationMode);
    listenMessage('room:mode:checkIsPresentation', checkIsPresentationMode);
    listenMessage('room:finishLesson', finishLesson);
    listenMessage('room:checkIsTeacherInRoom', checkIsTeacherInRoom);
    listenMessage('room:pause', pauseLesson);
    listenMessage('room:addTime', addTime);
};

function* toggleBetweenWebinarOrPresentationMode(client, message) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    room.toggleBetweenWebinarOrPresentationMode(user);
}

function* checkIsPresentationMode(client, message, responseChannel) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();

    const isPresentationMode = room.checkIsPresentationMode();

    responseChannel.sendAnswer(isPresentationMode);
}

function* checkIsTeacherInRoom(client, message, responseChannel) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();

    const isTeacherInRoom = room.checkIsTeacherInRoom();

    responseChannel.sendAnswer(isTeacherInRoom);
}

function* finishLesson(client, message, responseChannel) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const documentsList = message.documentsList;

    const sharedDocumentsInLesson = {
        documentsList,
        roomId: room.id
    };

    yield room.finishLesson(sharedDocumentsInLesson, user);

    responseChannel.sendAnswer(room.toDto());
}


function* pauseLesson(client, message, responseChannel) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    room.pauseLesson(user);

    responseChannel.sendAnswer(room.toDto());
}

function* addTime(client, message, responseChannel) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();
    const duration = message.duration;

    room.addTime(user, duration);

    responseChannel.sendAnswer(room.toDto());
}
