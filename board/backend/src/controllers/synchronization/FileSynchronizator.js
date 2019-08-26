'use strict';

const Synchronizator = require('./Synchronizator');

class FileSynchronizator extends Synchronizator {
    register(room) {
        room.getFileHistory()
            .on('videoFile:new', this.makeListener(room, this.handleNewVideo))
            .on('videoFile:update', this.makeListener(room, this.handleUpdateVideoInfo))
            .on('videoFile:remove', this.makeListener(room, this.handleRemoveVideo));
    }

    handleNewVideo(room, videoInfo, user) {
        this.getBroadcastChannel(room, user)
            .sendToOtherMembers('videoFile:new', {result: videoInfo});
    }

    handleUpdateVideoInfo(room, videoInfo, user) {
        this.getBroadcastChannel(room, user)
            .sendToOtherMembers('videoFile:updated', {result: videoInfo});
    }

    handleRemoveVideo(room, user) {
        this.getBroadcastChannel(room, user)
            .sendToOtherMembers('videoFile:remove');
    }

    unregister(room) {
        room.getFileHistory()
            .removeListener('videoFile:new', this.popListener(room, this.handleNewVideo))
            .removeListener('videoFile:update', this.popListener(room, this.handleUpdateVideoInfo))
            .removeListener('videoFile:remove', this.popListener(room, this.handleRemoveVideo));
    }
}

module.exports = FileSynchronizator;

