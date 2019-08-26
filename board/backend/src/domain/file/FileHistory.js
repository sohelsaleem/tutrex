'use strict';

const AsyncEventEmitter = require('../AsyncEventEmitter');

class FileHistory extends AsyncEventEmitter {
    constructor() {
        super();

        this.youtubeURL = null;
        this.userId = null;
        this.playbackState = null;
        this.playbackTime = 0;
    }

    addYoutubeURL(youtubeURL, user) {
        this.youtubeURL = youtubeURL;
        this.userId = user.id;
        this.emit('videoFile:new', {youtubeURL, userId: user.id}, user);
    }

    changePlaybackState(playbackState, user) {
        this.playbackState = playbackState;
        this.emit('videoFile:update', this.toDto(), user);
    }

    changePlaybackTime(playbackTime, user) {
        this.playbackTime = playbackTime;
        this.emit('videoFile:update', this.toDto(), user);
    }

    removeVideo(user) {
        this.youtubeURL = null;
        this.playbackState = null;
        this.playbackTime = 0;
        this.emit('videoFile:remove', user);
    }

    toDto() {
        return {
            youtubeURL: this.youtubeURL,
            playbackState: this.playbackState,
            playbackTime: this.playbackTime,
            userId: this.userId
        };
    }
}

module.exports = FileHistory;
