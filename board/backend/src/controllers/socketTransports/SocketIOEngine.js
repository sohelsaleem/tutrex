'use strict';

const AbstractSocketEngine = require('./AbstractSocketEngine');
const socketIO = require('socket.io');
const SocketIOTransport = require('./SocketIOTransport');

class SocketIOEngine extends AbstractSocketEngine {

    constructor() {
        super();
        this.io = null;
    }

    listen(httpServer) {
        this.io = socketIO.listen(httpServer);
        this.io.on('connection', socket => this._handleConnection(socket));
    }

    _handleConnection(socket) {
        this.emit('connection', new SocketIOTransport(socket));
    }
}

module.exports = SocketIOEngine;
