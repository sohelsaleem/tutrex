'use strict';

const SocketRoomBroadcastChannel = require('./SocketRoomBroadcastChannel');
const authService = require('../../domain/room/AuthService');

class SocketClient {
    constructor(socketChannel, clientTable) {
        this.socketChannel = socketChannel;
        this.clientTable = clientTable;

        this.socketChannel.on('disconnect', () => this.logout());
    }

    login(user, room) {
        logger.info('User logged IN', 'user id =', user.id, ', room id =', room.id);

        const responseFromLogin = authService.login(user, room);
        if (responseFromLogin.result) {
            this.clientTable.bindChannel(this.socketChannel, user.id, room.id);
        }

        return responseFromLogin;
    }

    logout() {
        logger.info('User logged OUT', 'user id =', this.getUserId(), ', room id =', this.getRoomId());

        authService.logout(this.getUserId(), this.getRoomId());
        this.clientTable.unbindChannel(this.socketChannel);
    }

    getUserId() {
        return this.clientTable.getUserIdByChannel(this.socketChannel);
    }

    getRoomId() {
        return this.clientTable.getRoomIdByChannel(this.socketChannel);
    }

    getBroadcastChannel() {
        return new SocketRoomBroadcastChannel(this.clientTable, this.getUserId(), this.getRoomId());
    }
}

module.exports = SocketClient;
