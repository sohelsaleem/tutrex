'use strict';

const AsyncEventEmitter = require('../AsyncEventEmitter');

class VideoChatInfo extends AsyncEventEmitter {
    constructor() {
        super();
        this.chatInfos = [];
    }

    generate(userId, streamType, callId) {
        const chatInfo = {
            callerId: userId,
            streamType,
            callIds: [callId],
            endpoints: {},
            candidatesQueue: {}
        };
        this.chatInfos.push(chatInfo);

        return chatInfo;
    }

    getByCallerIdAndStreamType(callerId, streamType) {
        return this.chatInfos.find(chatInfo => chatInfo.callerId == callerId && chatInfo.streamType == streamType);
    }

    getByCallId(callId) {
        for (let i = 0; i < this.chatInfos.length; i++) {
            const chatInfo = this.chatInfos[i];
            for (var j = 0; j < chatInfo.callIds.length; j++) {
                if (chatInfo.callIds[j] == callId) {
                    return chatInfo;
                }
            }
        }
        return null;
    }

    removeByCallerId(callerId) {
        this.chatInfos = this.chatInfos.filter(chatInfo => chatInfo.callerId != callerId);
        this.clearPipelineIfNeeded();
    }

    removeByCallId(callId) {
        this.chatInfos = this.chatInfos.filter(chatInfo => {
            for (var j = 0; j < chatInfo.callIds.length; j++) {
                if (chatInfo.callIds[j] == callId) {
                    return false;
                }
            }
            return true;
        });
        this.clearPipelineIfNeeded();
    }

    getList() {
        return this.chatInfos;
    }

    clearPipelineIfNeeded() {
        if (!this.chatInfos.length && this.pipeline) {
            this.pipeline.release();
            this.pipeline = null;
        }
    }
}

module.exports = VideoChatInfo;

