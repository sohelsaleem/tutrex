'use strict';

const _ = require('lodash');

module.exports = function (requestId, event) {
    return new SocketResponseChannel(requestId, event)
};

class SocketResponseChannel {
    constructor(channel, requestId, event) {
        this.channel = channel;
        this.requestId = requestId;
        this.event = event;
    }

    sendAnswer(answer) {
        this._sendMessage('success', {
            body: answer
        });
    }

    _sendMessage(status, other) {
        const message = _.assign({}, other, {
            requestId: this.requestId,
            event: this.event,
            status
        });

        this.channel.send(message);
    }

    sendError(code, error) {
        this._sendMessage('error', {
            code,
            message: error.message,
            body: {}
        });
    }
}
