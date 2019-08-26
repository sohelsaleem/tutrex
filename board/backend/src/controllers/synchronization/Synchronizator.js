'use strict';

const SocketRoomBroadcastChannel = require('../socketChannel/SocketRoomBroadcastChannel');

class Synchronizator {

    constructor() {
        this.socketClientTable = null;
        this.listeners = {};
    }

    register(room) {
        throw new Error('method <register> must be implemented');
    }

    unregister(room) {
        throw new Error('method <unregister> must be implemented');
    }

    makeListener(room, listener) {
        const proxy = listener.bind(this, room);

        this.listeners[room.id] = this.listeners[room.id] || [];
        this.listeners[room.id].push({
            listener,
            proxy
        });

        return proxy;
    }

    popListener(room, listener) {
        this.listeners[room.id] = this.listeners[room.id] || [];
        const listenerList = this.listeners[room.id];

        const listenerObject = listenerList.find(o => o.listener === listener);

        this.listeners[room.id] = listenerList.filter(o => o !== listenerObject);

        if (this.listeners[room.id].length === 0)
            delete this.listeners[room.id];

        return listenerObject.proxy;
    }

    getBroadcastChannel(room, user) {
        const userId = user ? user.id : '';
        const roomId = room.id;

        return new SocketRoomBroadcastChannel(this.socketClientTable, userId, roomId);
    }

    getUserChannel(userId) {
        return this.socketClientTable.findFirstChannelForUserId(userId);
    }
}

module.exports = Synchronizator;
