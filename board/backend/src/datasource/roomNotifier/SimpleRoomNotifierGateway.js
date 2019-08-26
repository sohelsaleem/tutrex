module.exports = {
    markUserEnteredInRoom,
    markUserLeftRoom,
    addLessonRecord,
    tryFinishLesson
};

function markUserEnteredInRoom(user){
}

function markUserLeftRoom(userId, roomId){
}

function* addLessonRecord(lessonRecord) {
    logger.debug('New lesson record with id', lessonRecord.id, lessonRecord.url);
}

function* tryFinishLesson(sharedDocumentsInLesson) {
}
