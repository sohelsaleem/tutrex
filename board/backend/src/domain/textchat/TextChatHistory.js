'use strict';

const _ = require('lodash');
const AsyncEventEmitter = require('../AsyncEventEmitter');

const MAX_HISTORY_ITEM_COUNT = 150;

class TextChatHistory extends AsyncEventEmitter {
    constructor(options) {
        super();
        this.maxHistoryItemCount = _.get(options, 'maxHistoryItemCount', MAX_HISTORY_ITEM_COUNT);

        this.chatItemList = [];
    }

    addChatItem(chatItem, author) {
        this.chatItemList.push(chatItem);
        this.chatItemList.slice(-MAX_HISTORY_ITEM_COUNT);

        this.emit('new', chatItem, author);
    }

    getChatItemList(user) {
        if (user.isTeacher) {
            return this.chatItemList.slice();
        } else {
            return this.chatItemList.filter(item => item.to == 'all' || item.to == user.id || item.from == user.id);
        }

    }
}

module.exports = TextChatHistory;
