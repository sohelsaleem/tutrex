const api = require('../api/makeApiRequest');

module.exports = {
    markUserEnteredInRoom,
    markUserLeftRoom,
    addLessonRecord,
    tryFinishLesson
};

function markUserEnteredInRoom(user){
    const requestOptions = {
        relativeUrl: 'room.in',
        method: 'post',
        parameters: {
            userId: user.id,
            roomId: user.roomId
        }
    };

    api.apiRequest(requestOptions);
}

function markUserLeftRoom(userId, roomId){
    const requestOptions = {
        relativeUrl: 'room.out',
        method: 'post',
        parameters: {
            userId,
            roomId
        }
    };

    api.apiRequest(requestOptions);
}

function* addLessonRecord(lessonRecord) {
    const requestOptions = {
        relativeUrl: 'add-lesson-record',
        method: 'post',
        parameters: {
            roomId: lessonRecord.roomId,
            recordId: lessonRecord.id,
            recordURL: lessonRecord.url,
            recordPath: lessonRecord.path
        }
    };

    return yield api.makeApiRequest(requestOptions);
}

function* tryFinishLesson(sharedDocumentsInLesson) {
    const requestOptions = {
        relativeUrl: 'finish-lesson',
        method: 'post',
        parameters: {
            documentsList: sharedDocumentsInLesson.documentsList,
            roomId: sharedDocumentsInLesson.roomId
        }
    };

    return yield api.makeApiRequest(requestOptions);
}