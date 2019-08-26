export const SHARE_VIDEO = 'videoFile/SHARE_VIDEO';
export const FINISH_VIDEO_SHARING = 'videoFile/FINISH_VIDEO_SHARING';

export const SOCKET_SHARE_VIDEO = 'videoFile:share';
export const SOCKET_FINISH_VIDEO_SHARING = 'videoFile:finishSharing';
export const SOCKET_NEW_VIDEO = 'videoFile:new';
export const SOCKET_REMOVE_VIDEO = 'videoFile:remove';

export function shareVideo(youtubeURL) {
    return {
        type: SHARE_VIDEO,
        socketSend: {
            event: SOCKET_SHARE_VIDEO,
            body: {
                youtubeURL
            }
        },
        youtubeURL
    };
}

export function finishVideoSharing() {
    return {
        type: FINISH_VIDEO_SHARING,
        socketSend: {
            event: SOCKET_FINISH_VIDEO_SHARING,
            body: {}
        }
    };
}

export const GET_VIDEO_FILE_HISTORY = 'videoFile/GET_VIDEO_FILE_HISTORY';
export const GET_VIDEO_FILE_HISTORY_SUCCESS = 'videoFile/GET_VIDEO_FILE_HISTORY_SUCCESS';
export const GET_VIDEO_FILE_HISTORY_FAILURE = 'videoFile/GET_VIDEO_FILE_HISTORY_FAILURE';

export function getVideoFileHistory() {
    return {
        types: [GET_VIDEO_FILE_HISTORY, GET_VIDEO_FILE_HISTORY_SUCCESS, GET_VIDEO_FILE_HISTORY_FAILURE],
        socketRequest: {
            event: 'videoFile:history',
            body: {}
        }
    };
}

export const CHANGE_PLAYBACK_STATE = 'videoFile/CHANGE_PLAYBACK_STATE';
export const SOCKET_CHANGE_PLAYBACK_STATE = 'videoFile:changePlaybackState';
export const SOCKET_VIDEO_FILE_UPDATED = 'videoFile:updated';

export function changePlaybackState(playbackState) {
    return {
        type: CHANGE_PLAYBACK_STATE,
        socketSend: {
            event: SOCKET_CHANGE_PLAYBACK_STATE,
            body: {
                playbackState
            }
        },
        playbackState
    };
}
export const CHANGE_PLAYBACK_TIME = 'videoFile/CHANGE_PLAYBACK_TIME';
export const SOCKET_CHANGE_PLAYBACK_TIME = 'videoFile:changePlaybackTime';

export function changePlaybackTime(playbackTime) {
    return {
        type: CHANGE_PLAYBACK_TIME,
        socketSend: {
            event: SOCKET_CHANGE_PLAYBACK_TIME,
            body: {
                playbackTime
            }
        },
        playbackTime
    };
}
