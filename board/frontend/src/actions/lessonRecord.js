export const REQUEST_RECORDING_STATE = 'lessonRecord/REQUEST_RECORDING_STATE';
export const REQUEST_RECORDING_STATE_SUCCESS = 'lessonRecord/REQUEST_RECORDING_STATE_SUCCESS';
export const REQUEST_RECORDING_STATE_FAILURE = 'lessonRecord/REQUEST_RECORDING_STATE_FAILURE';

export const INITIATE_RECORD_LESSON = 'lessonRecord/INTITIATE_RECORD_LESSON';
export const CANCEL_RECORD_LESSON = 'lessonRecord/CANCEL_RECORD_LESSON';
export const START_RECORD_LESSON = 'lessonRecord/START_RECORD_LESSON';
export const STOP_RECORD_LESSON = 'lessonRecord/STOP_RECORD_LESSON';

export const UPLOAD_RECORD_CHUNK = 'lessonRecord/UPLOAD_RECORD_CHUNK';
export const UPLOAD_RECORD_CHUNK_PROGRESS = 'lessonRecord/UPLOAD_RECORD_CHUNK_PROGRESS';
export const UPLOAD_RECORD_CHUNK_SUCCESS = 'lessonRecord/UPLOAD_RECORD_CHUNK_SUCCESS';
export const UPLOAD_RECORD_CHUNK_CANCEL = 'lessonRecord/UPLOAD_RECORD_CHUNK_CANCEL';
export const UPLOAD_RECORD_CHUNK_FAILURE = 'lessonRecord/UPLOAD_RECORD_CHUNK_FAILURE';

export const CONSUME_RECORD_CHUNK = 'lessonRecord/CONSUME_RECORD_CHUNK';

export function requestRecordingState() {
    return {
        types: [REQUEST_RECORDING_STATE, REQUEST_RECORDING_STATE_SUCCESS, REQUEST_RECORDING_STATE_FAILURE],
        socketRequest: {
            event: 'lessonRecord:getRecordingState',
            body: {}
        }
    };
}

export function startRecordLesson({recordId}) {
    return {
        type: START_RECORD_LESSON,
        recordId,
        socketSend: {
            event: 'lessonRecord:start',
            body: {
                recordId
            }
        }
    };
}

export function uploadRecordChunk({recordId, ordinal, blob}) {
    return {
        type: UPLOAD_RECORD_CHUNK,
        types: [
            UPLOAD_RECORD_CHUNK_PROGRESS,
            UPLOAD_RECORD_CHUNK_SUCCESS,
            UPLOAD_RECORD_CHUNK_CANCEL,
            UPLOAD_RECORD_CHUNK_FAILURE
        ],
        socketUpload: {
            event: 'lessonRecord:chunk',
            body: {
                recordId,
                ordinal
            },
            file: blob,
            requestId: recordId + '_' + ordinal
        }
    };
}

export function consumeRecordChunk(ordinal) {
    return {
        type: CONSUME_RECORD_CHUNK,
        ordinal
    };
}

export function stopRecordLesson({recordId}) {
    return {
        type: STOP_RECORD_LESSON,
        socketSend: {
            event: 'lessonRecord:stop',
            body: {
                recordId
            }
        }
    };
}

export function initiateRecordLesson() {
    return {
        type: INITIATE_RECORD_LESSON
    };
}

export function cancelRecordLesson() {
    return {
        type: CANCEL_RECORD_LESSON,
        socketSend: {
            event: 'lessonRecord:cancel',
            body: {}
        }
    };
}