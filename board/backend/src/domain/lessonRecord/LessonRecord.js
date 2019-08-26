'use strict';

const AsyncEventEmitter = require('../AsyncEventEmitter');

class LessonRecord extends AsyncEventEmitter {
    constructor() {
        super();
        this.isRecording = false;
    }

    getIsRecording() {
        return this.isRecording;
    }

    setIsRecording(isRecording) {
        this.isRecording = isRecording;
    }
}

module.exports = LessonRecord;
