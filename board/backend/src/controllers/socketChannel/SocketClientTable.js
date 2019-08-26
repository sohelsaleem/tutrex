'use strict';

const _ = require('lodash');

class SocketClientTable {
    constructor() {
        this.clientTable = {};
    }

    bindChannel(socketChannel, userId, roomId) {
        this.clientTable[socketChannel.id] = {
            socketChannel,
            userId,
            roomId
        };
    }

    unbindChannel(socketChannel) {
        delete this.clientTable[socketChannel.id];
    }

    getChannelById(socketChannelId) {
        const client = this.clientTable[socketChannelId];
        return _.get(client, 'socketChannel', null);
    }

    getUserIdByChannel(socketChannel) {
        const client = this.clientTable[socketChannel.id];
        return _.get(client, 'userId', null);
    }

    getRoomIdByChannel(socketChannel) {
        const client = this.clientTable[socketChannel.id];
        return _.get(client, 'roomId', null);
    }

    findFirstChannel(matcher) {
        return this.findChannelList(matcher)[0];
    }

    findChannelList(matcher) {
        const matchingFunc = _.isFunction(matcher) ? matcher : _.matches(matcher);

        return _.chain(this.clientTable)
            .toPairs()
            .filter(_.flow(_.property('[1]'), matchingFunc))
            .map(row => row[1].socketChannel)
            .value();
    }

    findFirstChannelForUser(user) {
        return this.findFirstChannelForUserId(user.id);
    }

    findFirstChannelForUserId(userId) {
        return this.findFirstChannel({userId})
    }

    findChannelListForRoom(room) {
        return this.findChannelListForRoomId(room.id);
    }

    findChannelListForRoomId(roomId) {
        return this.findChannelList({roomId});
    }

    findChannelListForRoomIdExceptUserId(roomId, userId) {
        return this.findChannelList(row => {
            return row.roomId === roomId && row.userId !== userId;
        });
    }}


module.exports = SocketClientTable;
