'use strict';

const UserHelper = require('./helpers/UserHelper');

module.exports = function (listenMessage) {
    listenMessage('videoFile:share', shareVideoFile);
    listenMessage('videoFile:changePlaybackState', changePlaybackState);
    listenMessage('videoFile:changePlaybackTime', changePlaybackTime);
    listenMessage('videoFile:finishSharing', finishVideoFileSharing);
    listenMessage('videoFile:history', getVideoFileHistory);
};

function* shareVideoFile(client, message) {
    const youtubeURL = message.youtubeURL;

    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const fileHistory = room.getFileHistory();
    fileHistory.addYoutubeURL(youtubeURL, user);
}

function* changePlaybackState(client, message) {
    const playbackState = message.playbackState;

    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const fileHistory = room.getFileHistory();
    fileHistory.changePlaybackState(playbackState, user);
}

function* changePlaybackTime(client, message) {
    const playbackTime = message.playbackTime;

    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const fileHistory = room.getFileHistory();
    fileHistory.changePlaybackTime(playbackTime, user);
}

function* finishVideoFileSharing(client) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const user = userHelper.getUser();

    const fileHistory = room.getFileHistory();
    fileHistory.removeVideo(user);
}

function* getVideoFileHistory(client, message, responseChannel) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();

    const fileHistory = room.getFileHistory();

    responseChannel.sendAnswer(fileHistory.toDto());
}

