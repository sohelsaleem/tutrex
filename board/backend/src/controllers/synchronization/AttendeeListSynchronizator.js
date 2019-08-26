'use strict';

const Synchronizator = require('./Synchronizator');

class AttendeeListSynchronizator extends Synchronizator {
    register(room) {
        room.getAttendeeList()
            .on('added', this.makeListener(room, this.handleAddMember))
            .on('updated', this.makeListener(room, this.handleUpdateMember))
            .on('removed', this.makeListener(room, this.handleRemoveMember));
    }

    handleAddMember(room, member) {
        this.getBroadcastChannel(room, member)
            .sendToOtherMembers('attendeeList:added', {member});
    }

    handleRemoveMember(room, member) {
                        logger.debug('REMOVE', member);
        this.getBroadcastChannel(room, member)
            .sendToOtherMembers('attendeeList:removed', {member});
    }

    handleUpdateMember(room, member) {
        this.getBroadcastChannel(room, member)
            .sendToRoom('attendeeList:updated', {member});
    }

    unregister(room) {
        room.getAttendeeList()
            .removeListener('added', this.popListener(room, this.handleAddMember))
            .removeListener('updated', this.popListener(room, this.handleUpdateMember))
            .removeListener('removed', this.popListener(room, this.handleRemoveMember));
    }
}

module.exports = AttendeeListSynchronizator;
