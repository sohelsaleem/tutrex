import WebRTCFactory from './WebRTCFactory';

import {publishVideoChat, joinVideoChat, sendCandidate,
    closeVideoChat, addLocalStream, addRemoteStream, removeRemoteStream} from 'actions/videoChat';

const uuid = require('node-uuid');

class WebRTCService {
    constructor() {
        this.chatInfos = [];
    }

    addStore(store) {
        // need store for dispatching actions
        this.store = store;
    }

    publishChat(userId, streamType, stream) {
        const pc = WebRTCFactory.createPeerConnection();

        // callerId = userId
        const chatInfo = new ChatInfo(userId, userId, streamType, pc, stream);
        this.chatInfos.push(chatInfo);

        this._handleIceCandidates(pc, chatInfo);

        pc.addStream(stream);

        this._createOffer(pc, chatInfo, publishVideoChat);

        this.store.dispatch(addLocalStream(chatInfo.callId, userId, streamType, stream));
    }

    unpublishChat(userId, streamType) {
        const dispatch = this.store.dispatch;
        this.chatInfos = this.chatInfos.filter(item => {
            const needToRemove = item.callerId == userId && item.streamType == streamType;
            if (needToRemove) {
                dispatch(closeVideoChat(item.callId, item.callerId, item.streamType));
                this.closeVideoChat(item);
            }
            return !needToRemove;
        });
    }

    startViewer(callerId, userId, streamType) {
        const pc = WebRTCFactory.createPeerConnection();

        const chatInfo = new ChatInfo(callerId, userId, streamType, pc);
        this.chatInfos.push(chatInfo);

        pc.onaddstream = (e) => {
            this.store.dispatch(addRemoteStream(chatInfo.callId, callerId, streamType, e.stream));
        };

        this._handleIceCandidates(pc, chatInfo);

        this._createOffer(pc, chatInfo, joinVideoChat, true);
    }

    addIceCandidate(message) {
        const chatInfo = this._getChatInfoByCallId(message.callId);
        if (!chatInfo) return;

        if (chatInfo.sdpAnswerSet) {
            chatInfo.peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
        } else {
            chatInfo.candidatesQueue.push(message.candidate);
        }
    }

    addSDPAnswer(message) {
        const chatInfo = this._getChatInfoByCallId(message.callId);
        if (!chatInfo) return;

        const answer = new RTCSessionDescription({
            type: 'answer',
            sdp: message.answer
        });

        chatInfo.peerConnection.setRemoteDescription(answer).then(() => {
            chatInfo.sdpAnswerSet = true;

            chatInfo.candidatesQueue.forEach(candidate => {
                chatInfo.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            });
        });
    }

    removeStreamByCallId(callId) {
        this.chatInfos = this.chatInfos.filter(item => {
            const needToRemove = item.callId == callId;
            if (needToRemove) {
                this.closeVideoChat(item);
            }
            return !needToRemove;
        });
    }

    closeVideoChat(chatInfo) {
        if (chatInfo.stream) {
            chatInfo.stream.getVideoTracks().forEach(track => {
                track.stop();
            });
            chatInfo.stream.getAudioTracks().forEach(track => {
                track.stop();
            });
        }
        if (chatInfo.peerConnection && chatInfo.peerConnection.iceConnectionState !== 'closed')
            chatInfo.peerConnection.close();
        chatInfo.peerConnection = null;
    }

    removePublisherStreams(publisherId) {
        for (let i = 0; i < this.chatInfos.length; i++) {
            if (this.chatInfos[i].callerId == publisherId) {
                this.store.dispatch(removeRemoteStream(this.chatInfos[i].callId,
                    this.chatInfos[i].callerId, this.chatInfos[i].streamType));
                this.closeVideoChat(this.chatInfos[i]);
            }
        }
        this.chatInfos = this.chatInfos.filter(item => item.callerId != publisherId);
    }

    _createOffer(pc, chatInfo, socketCommand, isViewer) {
        const constraints = this._getConstraints(isViewer);
        pc.createOffer(constraints).then((description) => {
            pc.setLocalDescription(description).then(()=>{}, this._onCreateSessionDescriptionError);

            this.store.dispatch(socketCommand(chatInfo.getCursor(), description.sdp));
        }, this._onCreateSessionDescriptionError);
    }

    _getConstraints(isViewer) {
        return isViewer ? {
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        } : {};
    }

    _handleIceCandidates(pc, chatInfo) {
        pc.onicecandidate = (event) => {
            if (event.candidate)
                this.store.dispatch(sendCandidate(chatInfo.getCursor(), event.candidate));
        };
    }

    _getChatInfoByCallId(callId) {
        for (let i = 0; i < this.chatInfos.length; i++) {
            if (this.chatInfos[i].callId == callId) {
                return this.chatInfos[i];
            }
        }
        return null;
    }

    _onCreateSessionDescriptionError(error) {
        console.error('Failed to create session description: ' + error.toString());
    }
}

class ChatInfo {
    constructor(callerId, userId, streamType, peerConnection, stream) {
        this.callId = uuid.v4();
        this.callerId = callerId;
        this.userId = userId;
        this.streamType = streamType;
        this.peerConnection = peerConnection;
        this.candidatesQueue = [];
        this.stream = stream;
        this.sdpAnswerSet = false;
    }
    getCursor() {
        return {
            callId: this.callId,
            userId: this.userId,
            callerId: this.callerId,
            streamType: this.streamType
        };
    }
}

export default new WebRTCService();
