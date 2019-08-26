'use strict';

const Synchronizator = require('./Synchronizator');

class PollSynchronizator extends Synchronizator {
    register(room) {
        room.getPoll()
            .on('startPoll', this.makeListener(room, this.handleStartPoll))
            .on('endPoll', this.makeListener(room, this.handleEndPoll))
            .on('updatePoll', this.makeListener(room, this.handleUpdatePoll));
    }

    handleStartPoll(room, poll, user) {
        this.getBroadcastChannel(room, user)
            .sendToOtherMembers('poll:start', {poll});
    }

    handleEndPoll(room, user) {
        this.getBroadcastChannel(room, user)
            .sendToOtherMembers('poll:end');
    }

    handleUpdatePoll(room, poll, user) {
        this.getBroadcastChannel(room, user)
            .sendToOtherMembers('poll:update', {poll});
    }

    unregister(room) {
        room.getPoll()
            .removeListener('startPoll', this.popListener(room, this.handleStartPoll))
            .removeListener('endPoll', this.popListener(room, this.handleEndPoll))
            .removeListener('updatePoll', this.popListener(room, this.handleUpdatePoll));
    }
}

module.exports = PollSynchronizator;
