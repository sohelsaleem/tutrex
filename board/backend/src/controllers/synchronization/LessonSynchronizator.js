'use strict';

const Synchronizator = require('./Synchronizator');

class LessonSynchronizator extends Synchronizator {
    register(room) {
        room
            .on('finishedLesson', this.makeListener(room, this.handleFinishLesson))
            .on('toggledBetweenWebinarOrPresentationMode', this.makeListener(room, this.handleToggleBetweenWebinarOrPresentationMode))
            .on('pausedLesson', this.makeListener(room, this.handlePausedLesson))
            .on('addedTime', this.makeListener(room, this.handleAddedTime));
    }

    handleFinishLesson(room, member) {
        this.getBroadcastChannel(room, member)
            .sendToOtherMembers('room:lesson:finishedLesson', {member, room: room.toDto()});
    }

    handleToggleBetweenWebinarOrPresentationMode(room, member) {
        this.getBroadcastChannel(room, member)
            .sendToOtherMembers('room:mode:toggled', {member});
    }

    handlePausedLesson(room, member) {
        this.getBroadcastChannel(room, member)
            .sendToOtherMembers('room:paused', {result: room.toDto()});

    }

    handleAddedTime(room, member){
        this.getBroadcastChannel(room, member)
            .sendToOtherMembers('room:addedTime', {result: room.toDto()});
    }

    unregister(room) {
        room
            .removeListener('finishedLesson', this.popListener(room, this.handleFinishLesson))
            .removeListener('toggledBetweenWebinarOrPresentationMode', this.popListener(room, this.handleToggleBetweenWebinarOrPresentationMode))
            .removeListener('pausedLesson', this.popListener(room, this.handlePausedLesson))
            .removeListener('addedTime', this.popListener(room, this.handleAddedTime));
    }
}

module.exports = LessonSynchronizator;
