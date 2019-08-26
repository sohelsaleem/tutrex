'use strict';

class SocketRoomBroadcastChannel {
    constructor(clientTable, userId, roomId) {
        this.clientTable = clientTable;
        this.userId = userId;
        this.roomId = roomId;
    }
    
    sendToRoom(event, body) {
        const channelList = this.clientTable.findChannelListForRoomId(this.roomId);
        this._sendSimpleMessageToChannelList(channelList, event, body);
    }

    _sendSimpleMessageToChannelList(channelList, event, body) {
        channelList.forEach(channel => channel.sendSimpleMessage(event, body));
    }

    sendToOtherMembers(event, body) {
        const channelList = this.clientTable.findChannelListForRoomIdExceptUserId(this.roomId, this.userId);
        this._sendSimpleMessageToChannelList(channelList, event, body);
    }
}

module.exports = SocketRoomBroadcastChannel;
