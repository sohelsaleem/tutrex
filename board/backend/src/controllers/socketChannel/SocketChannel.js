'use strict';

const EventEmitter = require('events').EventEmitter;
const createResponseChannel = require('./SocketResponseChannel');
const uuid = require('node-uuid');

class SocketChannel extends EventEmitter {

    constructor(transport) {
        super();
        this.id = uuid.v4();
        this.transport = transport;

        this._listenEvents();
    }

    _listenEvents() {
        const handleMessage = this._handleMessage.bind(this);
        this.transport.on('message', handleMessage);

        this._listenReleaseEvents();
    }

    _handleMessage(message) {
        if (message.requestId)
            return this._handleRequest(message);

        this.emit(message.event, message.body);
    }

    _handleRequest(message) {
        const requestId = message.requestId;
        const event = message.event;
        const body = Object.assign({}, message.body, {
            stream: message.stream
        });

        const responseChannel = createResponseChannel(this, requestId, event);
        this.emit(event, body, responseChannel);
    }

    _listenReleaseEvents() {
        this.transport.once('disconnect', () => this.emit('disconnect'));
        this.transport.once('closed', () => {
            this.emit('closed');
            this.removeAllListeners();
            this.transport.removeAllListeners();
        });
    }

    send(message) {
        this.transport.send(message);
    }

    sendSimpleMessage(event, body) {
        this.send({event, body});
    }

    disconnect() {
        this.transport.disconnect();
    }
}

module.exports = SocketChannel;
