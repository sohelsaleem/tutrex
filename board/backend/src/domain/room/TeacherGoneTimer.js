'use strict';

const AsyncEventEmitter = require('../AsyncEventEmitter');

class TeacherGoneTimer extends AsyncEventEmitter {
    constructor(teacherGoneTimeoutMinutes) {
        super();
        this.teacherGoneTimeout = teacherGoneTimeoutMinutes * 60 * 1000;

        this.timer = null;
    }

    start() {
        if (!this.teacherGoneTimeout)
            return;

        this.timer = setTimeout(() => this.emit('teacher-gone-timer'), this.teacherGoneTimeout);
    }

    stop() {
        if (!this.teacherGoneTimeout)
            return;

        clearTimeout(this.timer);
        this.timer = null;
    }
}

module.exports = TeacherGoneTimer;
