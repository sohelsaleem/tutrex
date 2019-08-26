'use strict';
const KurentoConnector = require('../datasource/videoChat/kurentoConnector');
const kurento  = require('kurento-client');

const UserHelper = require('./helpers/UserHelper');

module.exports = function (listenMessage) {
    listenMessage('videoChat:publish', createVideoChat);
    listenMessage('videoChat:join', joinVideoChat);
    listenMessage('videoChat:candidate:add', addIceCandidate);
    listenMessage('videoChat:history', getHistory);
    listenMessage('videoChat:close', closeVideoChat);
};

function* createVideoChat(client, event) {
    try {
        const message = event.message;

        const userHelper = UserHelper(client);
        const videoChatInfo = userHelper.getRoom().getVideoChatInfo();

        const chatInfo = videoChatInfo.generate(message.userId, message.streamType, message.callId);

        if (!videoChatInfo.pipeline) {
            videoChatInfo.pipeline = yield createPipeline(message.userId);
        }

        const endpoint = yield videoChatInfo.pipeline.create('WebRtcEndpoint');
        chatInfo.endpoints[message.callId] = endpoint;
        chatInfo.callerEndpoint = endpoint;

        checkCandidatesQueue(chatInfo.candidatesQueue[message.callId], endpoint);

        handleIceCandidates(endpoint, client, message);

        const sdpAnswer = yield endpoint.processOffer(message.offer);

        yield endpoint.gatherCandidates();

        const answerMessage = Object.assign({}, message);
        delete answerMessage.offer;
        client.getBroadcastChannel()
            .sendToOtherMembers('videoChat:start', answerMessage);

        answerMessage.answer = sdpAnswer;
        client.socketChannel.sendSimpleMessage('videoChat:answer', answerMessage);
    } catch (error) {
        logger.error('Could not publish stream to kurento', error);
    }
}

function* createPipeline(userId) {
    const kurentoClient = yield KurentoConnector.getKurentoClient();
    const pipeline = yield kurentoClient.create('MediaPipeline');

    const projectNameTokens = ['tutrex'];
    if (config.pipelineSuffix)
        projectNameTokens.push(config.pipelineSuffix);

    pipeline.setName(projectNameTokens.join('_') + '__' + userId);

    return pipeline;
}

function* joinVideoChat(client, event) {
    try {
        const message = event.message;

        const userHelper = UserHelper(client);
        const videoChatInfo = userHelper.getRoom().getVideoChatInfo();

        const chatInfo = videoChatInfo.getByCallerIdAndStreamType(message.callerId, message.streamType);
        chatInfo.callIds.push(message.callId);

        const endpoint = yield videoChatInfo.pipeline.create('WebRtcEndpoint');
        chatInfo.endpoints[message.callId] = endpoint;

        checkCandidatesQueue(chatInfo.candidatesQueue[message.callId], endpoint);

        handleIceCandidates(endpoint, client, message);

        const sdpAnswer = yield endpoint.processOffer(message.offer);

        yield endpoint.gatherCandidates();

        yield chatInfo.callerEndpoint.connect(endpoint);

        const answerMessage = Object.assign({}, message);
        delete answerMessage.offer;
        answerMessage.answer = sdpAnswer;
        client.socketChannel.sendSimpleMessage('videoChat:answer', answerMessage);
    } catch (error) {
        logger.error('Could not join to pipeline: ', error);
    }

}

function* addIceCandidate(client, event) {
    const message = event.message;

    const userHelper = UserHelper(client);
    const videoChatInfo = userHelper.getRoom().getVideoChatInfo();

    const chatInfo = videoChatInfo.getByCallId(message.callId);
    
    if (!chatInfo || !message.candidate) {
        return;
    }
    const candidate = kurento.register.complexTypes.IceCandidate(message.candidate);

    if (chatInfo.endpoints[message.callId]) {
        chatInfo.endpoints[message.callId].addIceCandidate(candidate);
    } else {
        chatInfo.candidatesQueue[message.callId] = chatInfo.candidatesQueue[message.callId] || [];
        chatInfo.candidatesQueue[message.callId].push(candidate);
    }
}

function* getHistory(client, event) {
    const userHelper = UserHelper(client);
    const videoChatInfo = userHelper.getRoom().getVideoChatInfo();
    
    const chats = videoChatInfo.getList();
    for (let i = 0; i < chats.length; i++) {
        const chatInfo = chats[i];
        const message = {
            userId: chatInfo.callerId,
            streamType: chatInfo.streamType
        };
        client.socketChannel.sendSimpleMessage('videoChat:start', message);
    }
}

function* closeVideoChat(client, event) {
    const userHelper = UserHelper(client);
    const videoChatInfo = userHelper.getRoom().getVideoChatInfo();

    videoChatInfo.removeByCallId(event.callId);
    const answerMessage = Object.assign({}, event);
    client.getBroadcastChannel()
        .sendToOtherMembers('videoChat:removed', answerMessage);

    videoChatInfo.clearPipelineIfNeeded();
}

function handleIceCandidates(endpoint, client, message) {
    endpoint.on('OnIceCandidate', event => {
        const candidate = kurento.getComplexType('IceCandidate')(event.candidate);
        const candidateMessage = Object.assign({}, message);
        candidateMessage.candidate = candidate;

        client.socketChannel.sendSimpleMessage('videoChat:candidate:new', candidateMessage);
    });
}

function checkCandidatesQueue(queue, endpoint) {
    if (queue) {
        while (queue.length) {
            const candidate = queue.shift();
            endpoint.addIceCandidate(candidate);
        }
    }
}
