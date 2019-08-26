import {combineReducers} from 'redux';

import {SOCKET_DISCONNECTED} from 'actions/socketConnection'

import whiteboard from './whiteboard';
import textChat from './textChat';
import videoChat from './videoChat';
import attendeeList from './attendeeList';
import room from './room';
import version from './version';
import socketConnection from './socketConnection';
import lessonRecord from './lessonRecord';
import videoFile from './videoFile';
import documentUpload from './upload/document';
import imageUpload from './upload/image';
import fileUpload from './upload/file';
import displayStates from './displayStates';
import poll from './poll';
import {reducer as notificationsReducer} from 'reapop';

const appReducer = combineReducers({
    textChat,
    videoChat,
    attendeeList,
    room,
    version,
    socketConnection,
    lessonRecord,
    videoFile,
    whiteboard,
    documentUpload,
    imageUpload,
    fileUpload,
    displayStates,
    poll,
    notifications: notificationsReducer()
});

export default function(state, action) {
    if (action.type === SOCKET_DISCONNECTED)
        state = undefined;

    return appReducer(state, action);
}
