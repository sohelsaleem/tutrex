'use strict';

const EventEmitter = require('events').EventEmitter;

/**
 * emit events
 * - 'disconnect' - connection lost (server is not initiator)
 * - 'closed' - connection closed (any causes)
 * - 'message' - receive message from socket client
 */
class AbstractSocketTransport extends EventEmitter {

    constructor() {
        super();
    }

    send(message) {
        throw new Error('method <send> must be implemented');
    }

    disconnect() {
        throw new Error('method <disconnect> must be implemented');
    }
}

module.exports = AbstractSocketTransport;
