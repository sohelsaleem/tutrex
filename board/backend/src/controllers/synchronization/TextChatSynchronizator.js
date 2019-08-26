'use strict';

const Synchronizator = require('./Synchronizator');

class TextChatSynchronizator extends Synchronizator {
    register(room) {
        room.getTextChatHistory()
            .on('new', this.makeListener(room, this.handleNewChatItem));
    }

    handleNewChatItem(room, textChatItem, user) {
        if (textChatItem.to == 'all') {
            // broadcast to all students teacher message
            this.getBroadcastChannel(room, user)
                .sendToOtherMembers('textChat:message:new', {textChatItem});
        } else {
            this.getUserChannel(textChatItem.to).sendSimpleMessage('textChat:message:new', {textChatItem});
        }
    }

    unregister(room) {
        room.getTextChatHistory()
            .removeListener('new', this.popListener(room, this.handleNewChatItem));
    }
}

module.exports = TextChatSynchronizator;
