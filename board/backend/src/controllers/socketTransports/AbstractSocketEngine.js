'use strict';

const EventEmitter = require('events').EventEmitter;

/**
 * emit events
 * - 'connection' - new socket, return socket transport
 */
class AbstractSocketEngine extends EventEmitter {

    constructor() {
        super();
    }

    listen(httpServer) {
        throw new Error('method <listen> must be implemented');
    }
}

module.exports = AbstractSocketEngine;
