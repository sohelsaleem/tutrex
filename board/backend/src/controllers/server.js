'use strict';

const wrap = require('co').wrap;

const httpServerFactory = require('./httpServerFactory');
const SocketIOEngine = require('./socketTransports/SocketIOEngine');
const SocketChannel = require('./socketChannel/SocketChannel');
const SocketClient = require('./socketChannel/SocketClient');
const SocketClientTable = require('./socketChannel/SocketClientTable');

const allControllers = require('./allControllers');
const roomSynchronization = require('./synchronization/roomSynchronization');

const RoomsTimer = require('../domain/room/RoomsTimer');
const roomsTimer = new RoomsTimer();
roomsTimer.start();

class SocketServer {
    constructor() {
        this.httpServer = null;
        this.socketServerEngine = null;
        this.socketClientTable = new SocketClientTable();

        this._handleNewConnection = this._handleNewConnection.bind(this);
    }

    run() {
        this.httpServer = httpServerFactory();

        this.socketServerEngine = new SocketIOEngine();
        this.socketServerEngine.listen(this.httpServer);
        this.socketServerEngine.on('connection', this._handleNewConnection);

        roomSynchronization(this.socketClientTable);

        logger.info('Socket server listens on port ' + config.port);
        logger.info('---------------------');
    }

    _handleNewConnection(socketTransport) {
        const socketChannel = new SocketChannel(socketTransport);
        const socketClient = new SocketClient(socketChannel, this.socketClientTable);

        const listenMessage = this._createListenMessage(socketClient, socketChannel);

        allControllers.forEach(perform => perform(listenMessage));
    }

    _createListenMessage(socketClient, socketChannel) {
        return (event, listener) => {
            const proxyListener = this._createProxyListener(socketClient, listener);
            socketChannel.on(event, wrap(proxyListener));
        };
    }

    _createProxyListener(socketClient, listener) {
        return function* (message, responseChannel) {
            try {
                yield listener(socketClient, message, responseChannel);
            }
            catch (error) {
                logger.error('Socket Controller Error:', error);

                if (responseChannel)
                    responseChannel.sendError(500, error);
            }
        };
    }
}

module.exports = new SocketServer();