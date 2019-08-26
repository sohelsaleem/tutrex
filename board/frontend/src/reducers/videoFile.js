import {SHARE_VIDEO, FINISH_VIDEO_SHARING, SOCKET_NEW_VIDEO, SOCKET_REMOVE_VIDEO,
    GET_VIDEO_FILE_HISTORY_SUCCESS, CHANGE_PLAYBACK_STATE, CHANGE_PLAYBACK_TIME, SOCKET_VIDEO_FILE_UPDATED} from 'actions/videoFile';

const initialState = {};

export default function videoFileReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SHARE_VIDEO:
            return {
                ...state,
                youtubeURL: action.youtubeURL
            };
        case SOCKET_NEW_VIDEO:
            return {
                ...state,
                ...action.result
            };
        case FINISH_VIDEO_SHARING:
        case SOCKET_REMOVE_VIDEO:
            return {
                ...state,
                youtubeURL: null,
                playbackState: null
            };
        case GET_VIDEO_FILE_HISTORY_SUCCESS:
        case SOCKET_VIDEO_FILE_UPDATED:
            return {
                ...state,
                ...action.result
            };

        case CHANGE_PLAYBACK_STATE:
            return {
                ...state,
                playbackState: action.playbackState
            };

        case CHANGE_PLAYBACK_TIME:
            return {
                ...state,
                playbackTime: action.playbackTime
            };

        default:
            return state;
    }
}
