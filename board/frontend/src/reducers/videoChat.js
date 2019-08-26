import {ADD_LOCAL_STREAM, ADD_REMOTE_STREAM, CLOSE_VIDEO_CHAT, SOCKET_STREAM_REMOVED, REMOVE_REMOTE_STREAM} from 'actions/videoChat';
const initialState = {
    streams: []
};

export default function videoChatReducer(state = initialState, action = {}) {
    switch (action.type) {
        case ADD_LOCAL_STREAM:
        case ADD_REMOTE_STREAM:
            const streams = [...state.streams];
            const stream = {
                callId: action.callId,
                stream: action.stream,
                streamType: action.streamType,
                userId: action.userId
            };
            streams.push(stream);
            return {
                ...state,
                streams
            };
        case REMOVE_REMOTE_STREAM:
        case SOCKET_STREAM_REMOVED:
        case CLOSE_VIDEO_CHAT:
            const newStreams = state.streams.filter(data => data.callId != action.callId &&
                !(data.userId == action.callerId && data.streamType == action.streamType));
            return {
                ...state,
                streams: newStreams
            };
        default:
            return state;
    }
}

