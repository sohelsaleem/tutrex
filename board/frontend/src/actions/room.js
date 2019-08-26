export const LOGIN = 'room/LOGIN';
export const LOGIN_SUCCESS = 'room/LOGIN_SUCCESS';
export const LOGIN_FAIL = 'room/LOGIN_FAIL';

export const SYNC_TIME = 'room/SYNC_TIME';
export const SYNC_TIME_SUCCESS = 'room/SYNC_TIME_SUCCESS';
export const SYNC_TIME_FAIL = 'room/SYNC_TIME_FAIL';

export const GET_DOCUMENTS_LIST = 'room/GET_DOCUMENTS_LIST';
export const GET_DOCUMENTS_LIST_SUCCESS = 'room/GET_DOCUMENTS_LIST_SUCCESS';
export const GET_DOCUMENTS_LIST_FAIL = 'room/GET_DOCUMENTS_LIST_FAIL';

export const FINISH_LESSON = 'room/FINISH_LESSON';
export const FINISH_LESSON_SUCCESS = 'room/FINISH_LESSON_SUCCESS';
export const FINISH_LESSON_FAIL = 'room/FINISH_LESSON_FAIL';

export const TOOGLE_BETWEEN_WEBINAR_OR_PRESENTATION_MODE = 'room/TOOGLE_BETWEEN_WEBINAR_OR_PRESENTATION_MODE';

export const CHECK_IS_PRESENTATION_MODE = 'room/CHECK_IS_PRESENTATION_MODE';
export const CHECK_IS_PRESENTATION_MODE_SUCCESS = 'room/CHECK_IS_PRESENTATION_MODE_SUCCESS';
export const CHECK_IS_PRESENTATION_MODE_FAIL = 'room/CHECK_IS_PRESENTATION_MODE_FAIL';

export const CHECK_IS_TEACHER_IN_ROOM = 'room/CHECK_IS_TEACHER_IN_ROOM';
export const CHECK_IS_TEACHER_IN_ROOM_SUCCESS = 'room/CHECK_IS_TEACHER_IN_ROOM_SUCCESS';
export const CHECK_IS_TEACHER_IN_ROOM_FAIL = 'room/CHECK_IS_TEACHER_IN_ROOM_FAIL';

export const LESSON_PAUSE = 'room/LESSON_PAUSE';
export const LESSON_PAUSE_SUCCESS = 'room/LESSON_PAUSE_SUCCESS';
export const LESSON_PAUSE_FAIL = 'room/LESSON_PAUSE_FAIL';

export const LESSON_ADD_TIME = 'room/LESSON_ADD_TIME';
export const LESSON_ADD_TIME_SUCCESS = 'room/LESSON_ADD_TIME_SUCCESS';
export const LESSON_ADD_TIME_FAIL = 'room/LESSON_ADD_TIME_FAIL';

export const GET_STORAGE_LIST = 'room/GET_STORAGE_LIST';
export const GET_STORAGE_LIST_SUCCESS = 'room/GET_STORAGE_LIST_SUCCESS';
export const GET_STORAGE_LIST_FAIL = 'room/GET_STORAGE_LIST_FAIL';

export const IS_STORAGE_ITEM_AVAILABLE = 'room/IS_STORAGE_ITEM_AVAILABLE';
export const IS_STORAGE_ITEM_AVAILABLE_SUCCESS = 'room/IS_STORAGE_ITEM_AVAILABLE_SUCCESS';
export const IS_STORAGE_ITEM_AVAILABLE_FAIL = 'room/IS_STORAGE_ITEM_AVAILABLE_FAIL';

export const CONFIRM_RETURN_TO_LESSON = 'room/CONFIRM_RETURN_TO_LESSON';

export function login({token, tabId}) {
    return {
        types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
        socketRequest: {
            event: 'room:login',
            body: {
                token,
                tabId
            }
        }
    };
}

export function syncTime() {
    return {
        types: [SYNC_TIME, SYNC_TIME_SUCCESS, SYNC_TIME_FAIL],
        socketRequest: {
            event: 'room:syncTime',
            body: {}
        }
    };
}

export function getDocumentsList() {
    return {
        types: [GET_DOCUMENTS_LIST, GET_DOCUMENTS_LIST_SUCCESS, GET_DOCUMENTS_LIST_FAIL],
        socketRequest: {
            event: 'room:documents:list',
            body: {}
        }
    };
}

export function finishLesson(documentsList) {
    const message = {
        documentsList
    };
    return {
        types: [FINISH_LESSON, FINISH_LESSON_SUCCESS, FINISH_LESSON_FAIL],
        socketRequest: {
            event: 'room:finishLesson',
            body: message
        },
        message
    };
}

export function toggleBetweenWebinarOrPresentationMode() {
    return {
        type: TOOGLE_BETWEEN_WEBINAR_OR_PRESENTATION_MODE,
        socketSend: {
            event: 'room:mode:toggle',
            body: {}
        }
    };
}

export function checkIsPresentationMode() {
    return {
        types: [CHECK_IS_PRESENTATION_MODE, CHECK_IS_PRESENTATION_MODE_SUCCESS, CHECK_IS_PRESENTATION_MODE_FAIL],
        socketRequest: {
            event: 'room:mode:checkIsPresentation',
            body: {}
        }
    };
}

export function checkIsTeacherInRoom() {
    return {
        types: [CHECK_IS_TEACHER_IN_ROOM, CHECK_IS_TEACHER_IN_ROOM_SUCCESS, CHECK_IS_TEACHER_IN_ROOM_FAIL],
        socketRequest: {
            event: 'room:checkIsTeacherInRoom',
            body: {}
        }
    };
}

export function pauseLesson() {
    return {
        types: [LESSON_PAUSE, LESSON_PAUSE_SUCCESS, LESSON_PAUSE_FAIL],
        socketRequest: {
            event: 'room:pause',
            body: {}
        }
    };
}

export function addTime(duration) {
    return {
        types: [LESSON_ADD_TIME, LESSON_ADD_TIME_SUCCESS, LESSON_ADD_TIME_FAIL],
        socketRequest: {
            event: 'room:addTime',
            body: {duration}
        }
    };
}


export function getStorageList(folderId) {
    return {
        types: [GET_STORAGE_LIST, GET_STORAGE_LIST_SUCCESS, GET_STORAGE_LIST_FAIL],
        socketRequest: {
            event: 'storage:list',
            body: {folderId}
        }
    };
}


export function isStorageItemAvailable(itemId) {
    return {
        types: [IS_STORAGE_ITEM_AVAILABLE, IS_STORAGE_ITEM_AVAILABLE_SUCCESS, IS_STORAGE_ITEM_AVAILABLE_FAIL],
        socketRequest: {
            event: 'storage:available',
            body: {itemId}
        }
    };
}

export function confirmReturnToLesson() {
    return {
        type: CONFIRM_RETURN_TO_LESSON
    };
}
