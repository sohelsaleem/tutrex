import RequestReducerHelper from '../helpers/RequestReducerHelper';
import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    SYNC_TIME_SUCCESS,
    GET_DOCUMENTS_LIST,
    GET_DOCUMENTS_LIST_SUCCESS,
    GET_DOCUMENTS_LIST_FAIL,
    FINISH_LESSON,
    FINISH_LESSON_SUCCESS,
    FINISH_LESSON_FAIL,
    TOOGLE_BETWEEN_WEBINAR_OR_PRESENTATION_MODE,
    CHECK_IS_PRESENTATION_MODE_SUCCESS,
    CHECK_IS_TEACHER_IN_ROOM_SUCCESS,

    LESSON_PAUSE,
    LESSON_PAUSE_SUCCESS,
    LESSON_PAUSE_FAIL,

    LESSON_ADD_TIME,
    LESSON_ADD_TIME_SUCCESS,
    LESSON_ADD_TIME_FAIL,

    GET_STORAGE_LIST,
    GET_STORAGE_LIST_FAIL,
    GET_STORAGE_LIST_SUCCESS,

    IS_STORAGE_ITEM_AVAILABLE,
    IS_STORAGE_ITEM_AVAILABLE_SUCCESS,
    IS_STORAGE_ITEM_AVAILABLE_FAIL,

    CONFIRM_RETURN_TO_LESSON
} from 'actions/room';
import {
    CHANGE_ATTENDEE_MEDIA_STATE,
    SOCKET_ATTENDEE_KICKED,
    SOCKET_ATTENDEE_LIST_UPDATED,
    SOCKET_ATTENDEE_LIST_ADDED,
    SOCKET_ATTENDEE_LIST_REMOVED
} from 'actions/attendeeList';

const SOCKET_FINISHED_LESSON = 'room:lesson:finishedLesson';
const SOCKET_TOOGLE_BETWEEN_WEBINAR_OR_PRESENTATION_MODE = 'room:mode:toggled';

const SOCKET_LESSON_PAUSED = 'room:paused';
const SOCKET_LESSON_ADDED_TIME = 'room:addedTime';

const initialState = {
    isPresentationMode: true,
    isTeacherInRoom: true,
    showReturnToLessonDialog: true
};

export default function roomReducer(state = initialState, action = {}) {
    const loginRequestHelper = new RequestReducerHelper('login', {resultKey: 'authInfo'});

    switch (action.type) {
        case LOGIN:
        case LOGIN_SUCCESS:
        case LOGIN_FAIL:
            return loginRequestHelper.getNextState(state, action);

        case SYNC_TIME_SUCCESS:
            return {
                ...state,
                lastServerTime: action.result.time
            };
        case CHANGE_ATTENDEE_MEDIA_STATE:
            return changeMediaState(state, action.message.mediaState);

        case SOCKET_ATTENDEE_KICKED:
            return {
                ...state,
                kicked: true
            };

        case GET_DOCUMENTS_LIST:
            return {
                ...state,
                gettingDocumentsList: true
            };
        case GET_DOCUMENTS_LIST_SUCCESS:
            return {
                ...state,
                documentsList: action.result,
                gettingDocumentsList: false
            };
        case GET_DOCUMENTS_LIST_FAIL:
            return {
                ...state,
                gettingDocumentsList: false
            };

        case GET_STORAGE_LIST:
            return {
                ...state,
                gettingStorageList: true
            };
        case GET_STORAGE_LIST_SUCCESS:
            return {
                ...state,
                storageList: action.result,
                gettingStorageList: false
            };
        case GET_STORAGE_LIST_FAIL:
            return {
                ...state,
                gettingStorageList: false
            };
        case IS_STORAGE_ITEM_AVAILABLE:
            return {
                ...clearItemAvailableState(state)
            };
        case IS_STORAGE_ITEM_AVAILABLE_SUCCESS:
            return {
                ...state,
                isItemAvailable: true,
                isItemAvailableProcessing: false
            };
        case IS_STORAGE_ITEM_AVAILABLE_FAIL:
            return {
                ...state,
                isItemAvailable:false,
                itemAvailabilityError: action.error,
                isItemAvailableProcessing: false
            };
        case FINISH_LESSON:
            return {
                ...state,
                finishLessonError: false,
                isLessonFinished: false
            };
        case FINISH_LESSON_SUCCESS:
        case SOCKET_FINISHED_LESSON:
            return {
                ...state,
                ...changeRoomState(state, action.result),
                isLessonFinished: true
            };
        case FINISH_LESSON_FAIL:
            return {
                ...state,
                finishLessonError: true
            };

        case CHECK_IS_PRESENTATION_MODE_SUCCESS:
            return {
                ...state,
                isPresentationMode: action.result
            };

        case CHECK_IS_TEACHER_IN_ROOM_SUCCESS:
            return {
                ...state,
                isTeacherInRoom: action.result
            };

        case TOOGLE_BETWEEN_WEBINAR_OR_PRESENTATION_MODE:
        case SOCKET_TOOGLE_BETWEEN_WEBINAR_OR_PRESENTATION_MODE:
            return {
                ...state,
                isPresentationMode: !state.isPresentationMode
            };

        case SOCKET_ATTENDEE_LIST_UPDATED:
            return updateUser(state, action.member);

        case SOCKET_ATTENDEE_LIST_ADDED:
            const isTeacherInRoom = state.isTeacherInRoom || action.member.isTeacher;

            return {
                ...state,
                isTeacherInRoom
            };
        case SOCKET_ATTENDEE_LIST_REMOVED:
            const isTeacherLeftRoom = state.isTeacherInRoom && action.member.isTeacher;
            const isTeacherInTheRoom = (isTeacherLeftRoom) ? false : state.isTeacherInRoom;

            return {
                ...state,
                isTeacherInRoom: isTeacherInTheRoom
            };
        case LESSON_PAUSE_SUCCESS:
        case SOCKET_LESSON_PAUSED:
            return changeRoomState(state, action.result);
        case LESSON_ADD_TIME_SUCCESS:
        case SOCKET_LESSON_ADDED_TIME:
            return changeRoomState(state, action.result);
        case CONFIRM_RETURN_TO_LESSON:
            return {
                ...state,
                showReturnToLessonDialog: false
            };
        default:
            return state;
    }
}

function changeMediaState(state, mediaState) {
    const authInfo = Object.assign({}, state.authInfo);
    authInfo.user.mediaState = mediaState;
    return {
        ...state,
        authInfo
    };
}

function updateUser(state, updatedUser) {
    const authInfo = Object.assign({}, state.authInfo);
    if (authInfo.user.id === updatedUser.id) {
        authInfo.user = updatedUser;
    }
    return {
        ...state,
        authInfo
    };
}

function changeRoomState(state, updatedRoom) {
    const authInfo = Object.assign({}, state.authInfo);
    authInfo.room = {...updatedRoom};
    return {
        ...state,
        authInfo
    };
}

function clearItemAvailableState(state){
    delete state.isItemAvailable;
    delete state.itemAvailabilityError;
    return {
        ...state,
        isItemAvailableProcessing: true
    };
}
