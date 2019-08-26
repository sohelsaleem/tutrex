export const PUBLISH_STREAM = 'videoChat/PUBLISH_STREAM';
export const UNPUBLISH_STREAM = 'videoChat/UNPUBLISH_STREAM';

export function publishStream(userId, streamType, stream) {
    return {
        type: PUBLISH_STREAM,
        userId,
        streamType,
        stream
    };
}

export function unpublishStream(userId, streamType) {
    return {
        type: UNPUBLISH_STREAM,
        userId,
        streamType
    };
}

export const ADD_LOCAL_STREAM = 'videoChat/ADD_LOCAL_STREAM';
export const ADD_REMOTE_STREAM = 'videoChat/ADD_REMOTE_STREAM';
export const REMOVE_REMOTE_STREAM = 'videoChat/REMOVE_REMOTE_STREAM';

export function addLocalStream(callId, userId, streamType, stream) {
    return {
        type: ADD_LOCAL_STREAM,
        callId,
        userId,
        streamType,
        stream
    };
}

export function addRemoteStream(callId, userId, streamType, stream) {
    return {
        type: ADD_REMOTE_STREAM,
        callId,
        userId,
        streamType,
        stream
    };
}

export function removeRemoteStream(callId, callerId, streamType) {
    return {
        type: REMOVE_REMOTE_STREAM,
        callId,
        callerId,
        streamType
    };
}


export const CLOSE_VIDEO_CHAT = 'videoChat/CLOSE_VIDEO_CHAT';
export const SOCKET_CLOSE_CHAT = 'videoChat:close';
export const SOCKET_STREAM_REMOVED = 'videoChat:removed';
export function closeVideoChat(callId, callerId, streamType) {
    return {
        type: CLOSE_VIDEO_CHAT,
        socketSend: {
            event: SOCKET_CLOSE_CHAT,
            body: {callId, callerId, streamType}
        },
        callId,
        callerId,
        streamType
    };
}

export const SEND_OFFER = 'videoChat/SEND_OFFER';
export const SOCKET_SEND_PUBLISH_VIDEO_CHAT = 'videoChat:publish';
export const SOCKET_SEND_ANSWER = 'videoChat:answer';
export const SOCKET_START_VIDEO_CHAT = 'videoChat:start';
export const SOCKET_JOIN_VIDEO_CHAT = 'videoChat:join';

export function publishVideoChat(chatInfo, offer) {
    const message = Object.assign({}, chatInfo, {offer});
    return {
        type: SEND_OFFER,
        socketSend: {
            event: SOCKET_SEND_PUBLISH_VIDEO_CHAT,
            body: {
                message
            }
        },
        message
    };
}

export function joinVideoChat(chatInfo, offer) {
    const message = Object.assign({}, chatInfo, {offer});
    return {
        type: SEND_OFFER,
        socketSend: {
            event: SOCKET_JOIN_VIDEO_CHAT,
            body: {
                message
            }
        },
        message
    };
}

export const SEND_CANDIDATE = 'videoChat/SEND_CANDIDATE';
export const SOCKET_ADD_CANDIDATE = 'videoChat:candidate:add';
export const SOCKET_NEW_CANDIDATE = 'videoChat:candidate:new';

export function sendCandidate(chatInfo, candidate) {
    const message = Object.assign({}, chatInfo, {candidate});
    return {
        type: SEND_CANDIDATE,
        socketSend: {
            event: SOCKET_ADD_CANDIDATE,
            body: {
                message
            }
        },
        message
    };
}

export const GET_VIDEO_CHAT_HISTORY = 'videoChat/GET_VIDEO_CHAT_HISTORY';
export const SOCKET_VIDEO_CHAT_HISTORY = 'videoChat:history';
export function getVideoChatHistory() {
    const message = {};
    return {
        type: GET_VIDEO_CHAT_HISTORY,
        socketSend: {
            event: SOCKET_VIDEO_CHAT_HISTORY,
            body: {
                message
            }
        },
        message
    };
}

