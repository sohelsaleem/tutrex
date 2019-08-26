import {PUBLISH_STREAM, UNPUBLISH_STREAM, SOCKET_NEW_CANDIDATE,
    SOCKET_START_VIDEO_CHAT, SOCKET_SEND_ANSWER, SOCKET_STREAM_REMOVED} from 'actions/videoChat';
import {SOCKET_ATTENDEE_LIST_REMOVED, SOCKET_ATTENDEE_LIST_UPDATED} from 'actions/attendeeList';
import {LOGIN_SUCCESS} from 'actions/room';

import WebRTCService from 'helpers/videoChat/WebRTCService';

export default function videoChatMiddleware() {
    let myUserId = 0;
    return ({dispatch, getState}) => next => action => {
        if (typeof action === 'function')
            return action(dispatch, getState);

        switch (action.type) {
            case LOGIN_SUCCESS:
                myUserId = action.result.user.id;
                break;
            case PUBLISH_STREAM:
                WebRTCService.publishChat(action.userId, action.streamType, action.stream);
                break;
            case UNPUBLISH_STREAM:
                WebRTCService.unpublishChat(action.userId, action.streamType);
                break;
            case SOCKET_NEW_CANDIDATE:
                WebRTCService.addIceCandidate(action);
                break;
            case SOCKET_SEND_ANSWER:
                WebRTCService.addSDPAnswer(action);
                break;
            case SOCKET_START_VIDEO_CHAT:
                WebRTCService.startViewer(action.userId, myUserId, action.streamType);
                break;
            case SOCKET_ATTENDEE_LIST_REMOVED:
                WebRTCService.removePublisherStreams(action.member.id);
                break;
            case SOCKET_STREAM_REMOVED:
                WebRTCService.removeStreamByCallId(action.callId);
                break;
            default:
                break;
        }

        return next(action);
    };
}

