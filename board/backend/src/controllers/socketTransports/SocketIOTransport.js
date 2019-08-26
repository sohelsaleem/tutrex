'use strict';

const AbstractSocketTransport = require('./AbstractSocketTransport');
const ss = require('socket.io-stream');

class SocketIOTransport extends AbstractSocketTransport {

    constructor(socket) {
        super();
        this.socket = socket;
        this.streamSocket = ss(this.socket);

        this._listenEvents();
    }

    _listenEvents() {
        const handleMessage = this._handleMessage.bind(this);

        this.socket.on('message', handleMessage);
        this.streamSocket.on('file', this._handleUploadMessage.bind(this));

        this.socket.once('disconnect', () => this._handleDisconnect());
    }

    _handleMessage(message) {
        this.emit('message', message);
    }

    _handleUploadMessage(stream, message) {
        this.emit('message', Object.assign({}, message, {stream}));
    }

    _handleDisconnect() {
        this.emit('disconnect');
        this._release();
    }

    _release() {
        this.socket.removeAllListeners();
        this.streamSocket.removeAllListeners();
        process.nextTick(() => this.emit('closed'));
    }

    send(message) {
        this.socket.send(message);
    }

    disconnect() {
        this._release();
    }
}

module.exports = SocketIOTransport;
