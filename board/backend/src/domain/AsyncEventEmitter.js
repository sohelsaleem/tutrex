'use strict';

const EventEmitter = require('events').EventEmitter;


class AsyncEventEmitter extends EventEmitter {
    constructor() {
        super();
    }

    emit() {
        const syncEmit = super.emit;

        const args = [].slice.apply(arguments);
        process.nextTick(() => {
            syncEmit.apply(this, args);
        });
    }
}

module.exports = AsyncEventEmitter;
