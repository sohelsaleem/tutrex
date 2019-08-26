'use strict';

const AsyncEventEmitter = require('../AsyncEventEmitter');

class RoomsTimer extends AsyncEventEmitter {
    start() {
        this.checkingLessonsTimer = setInterval(() => this.checkLessons(), 15000);
    }

    checkLessons() {
        const roomRepository = require('../repository/RepositoryRegistry').room;
        const roomsObject = roomRepository.table;
        if (Object.keys(roomsObject).length < 1) return;
        for (var roomId in roomsObject) {
            if (roomsObject[roomId].isLessonFinished) {
                roomRepository.removeById(roomId);
            }
        }
    }
}

module.exports = RoomsTimer;
