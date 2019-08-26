'use strict';

const UserHelper = require('./helpers/UserHelper');

const RecordFacade = require('../domain/lessonRecord/RecordFacade');

module.exports = function (listenMessage) {
    listenMessage('lessonRecord:getRecordingState', getRecordingState);
    listenMessage('lessonRecord:start', startLessonRecord);
    listenMessage('lessonRecord:chunk', handleLessonRecordChunk);
    listenMessage('lessonRecord:stop', stopLessonRecord);
    listenMessage('lessonRecord:cancel', cancelLessonRecord);
};

function* getRecordingState(client, message, responseChannel) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const lessonRecord = room.getLessonRecord();
    const isRecording = lessonRecord.getIsRecording();

    responseChannel.sendAnswer(isRecording);
}

function* startLessonRecord(client, message) {
    logger.debug('startLessonRecord', message);

    const recordId = message.recordId;

    const userHelper = UserHelper(client);
    const user = userHelper.getUser();
    const room = userHelper.getRoom();
    const lessonRecord = room.getLessonRecord();
    lessonRecord.setIsRecording(true);

    RecordFacade.stopAllSessionInRoom(room);

    RecordFacade.createSession(recordId, user, room)
        .initialize(room);
}

function* handleLessonRecordChunk(client, message, responseChannel) {
    const recordId = message.recordId;
    const recordOrdinal = message.ordinal;
    const chunkStream = message.stream;

    const session = RecordFacade.findSession(recordId);

    if (!session)
        return;

    yield session.appendChunk(chunkStream);

    responseChannel.sendAnswer({
        recordId,
        ordinal: recordOrdinal
    });
}

function* stopLessonRecord(client, message) {
    logger.debug('stopLessonRecord', message);
    const recordId = message.recordId;

    RecordFacade.stopSession(recordId);
}

function* cancelLessonRecord(client) {
    const userHelper = UserHelper(client);
    const room = userHelper.getRoom();
    const lessonRecord = room.getLessonRecord();
    lessonRecord.setIsRecording(false);
}
