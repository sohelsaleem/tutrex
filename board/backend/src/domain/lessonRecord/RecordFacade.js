'use strict';

const RecordSession = require('./RecordSession');
const _ = require('lodash');

class RecordFacade {

    constructor() {
        this.sessions = {};
        // this.roomRecordingExpirationTable = new RoomRecordingExpirationTable();
        // this.roomRecordingExpirationTable.on('expire', room => this.stopAllSessionInRoom(room));
    }

    createSession(recordId, user, room) {
        const session = new RecordSession(recordId, user, room);
        this.sessions[recordId] = session;

        this.stopSessonWhenTeacherLeaveRoom(user, room);

        return session;
    }

    stopSessonWhenTeacherLeaveRoom(teacher, room) {
        const listener = user => {
            if (user.id !== teacher.id)
                return;

            this.stopAllSessionInRoom(room);
            room.getAttendeeList().removeListener('removed', listener);
        };

        room.getAttendeeList().on('removed', listener);
    } 

    findSession(recordId) {
        return this.sessions[recordId];
    }

    stopSession(recordId) {
        const session = this.findSession(recordId);

        if (!session)
            return;

        this.removeSession(session);
        return session.stop();
    }

    removeSession(session) {
        delete this.sessions[session.id];
    }

    stopAllSessionInRoom(room) {
        const roomSessions = this.findSessionsInRoom(room);

        roomSessions.forEach(session => this.removeSession(session));

        return roomSessions.map(session => session.stop());
    }

    findSessionsInRoom(room) {
        return _.filter(this.sessions, {room});
    }
}

module.exports = new RecordFacade();