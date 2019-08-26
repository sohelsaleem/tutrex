import RequestReducerHelper from 'helpers/RequestReducerHelper';
import {
    REQUEST_RECORDING_STATE,
    REQUEST_RECORDING_STATE_SUCCESS,
    REQUEST_RECORDING_STATE_FAILURE,

    UPLOAD_RECORD_CHUNK_SUCCESS,
    CONSUME_RECORD_CHUNK,

    INITIATE_RECORD_LESSON,
    CANCEL_RECORD_LESSON
} from 'actions/lessonRecord';

const initialState = {
    consumingChunks: [],
    recordId: null,
    isRecording: false
};

export default function (state = initialState, action = {}) {
    const requestRecordingStateHelper = new RequestReducerHelper('isInterruptedRecording');

    switch (action.type) {
        case REQUEST_RECORDING_STATE:
        case REQUEST_RECORDING_STATE_SUCCESS:
        case REQUEST_RECORDING_STATE_FAILURE:
            return requestRecordingStateHelper.getNextState(state, action);

        case UPLOAD_RECORD_CHUNK_SUCCESS:
            return addConsumingChunk(state, action);

        case CONSUME_RECORD_CHUNK:
            return consumeRecordChunk(state, action);

        case INITIATE_RECORD_LESSON:
            return initiateRecording(state);

        case CANCEL_RECORD_LESSON:
            return cancelRecording(state);

        default:
            return state;
    }
}

function addConsumingChunk(state, action) {
    const {ordinal} = action;
    const {consumingChunks} = state;

    return {
        ...state,
        consumingChunks: [...consumingChunks, ordinal]
    };
}

function consumeRecordChunk(state, action) {
    const {ordinal} = action;
    const nextConsumingChunks = state.consumingChunks.filter(o => o !== ordinal);

    return {
        ...state,
        consumingChunks: nextConsumingChunks
    };
}

function initiateRecording(state) {
    return {
        ...state,
        isRecording: true,
        isInterruptedRecording: false
    };
}

function cancelRecording(state) {
    return {
        ...state,
        isRecording: false,
        isInterruptedRecording: false
    };
}


