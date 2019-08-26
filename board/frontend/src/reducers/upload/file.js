import {
    UPLOAD_FILE,
    UPLOAD_FILE_PROGRESS,
    UPLOAD_FILE_SUCCESS,
    UPLOAD_FILE_CANCEL,
    UPLOAD_FILE_FAILURE,
    UPLOAD_FILE_FROM_STORAGE,
    UPLOAD_FILE_FROM_STORAGE_SUCCESS,
    UPLOAD_FILE_FROM_STORAGE_FAIL
} from 'actions/upload';

const initialState = {
    inProgress: false,
    progress: 0,
    fileName: '',
    error: null
};

const actionReducers = {
    [UPLOAD_FILE]: uploadFile,
    [UPLOAD_FILE_PROGRESS]: updateUploadProgress,
    [UPLOAD_FILE_CANCEL]: cancelUploading,
    [UPLOAD_FILE_SUCCESS]: finishUpload,
    [UPLOAD_FILE_FAILURE]: failUpload,
    [UPLOAD_FILE_FROM_STORAGE]: uploadFromStorage,
    [UPLOAD_FILE_FROM_STORAGE_SUCCESS]: finishUpload,
    [UPLOAD_FILE_FROM_STORAGE_FAIL]: failUpload
};

export default function (state = initialState, action = {}) {
    const reducer = actionReducers[action.type];

    if (reducer)
        return reducer(state, action);
    else
        return state;
}

function uploadFile(state, action) {
    const fileName = action.file.name;

    return {
        inProgress: true,
        fileName
    };
}

function updateUploadProgress(state, action) {
    return {
        ...state,
        progress: action.progress
    };
}

function finishUpload(state, action) {
    const {fileURL} = action.result;

    return {
        ...state,
        inProgress: false,
        fileURL
    };
}

function failUpload(state, action) {
    return {
        ...state,
        inProgress: false,
        error: action.error
    };
}

function cancelUploading(state, action) {
    return {
        ...state,
        inProgress: false,
        error: null
    };
}

function uploadFromStorage(state, action) {
    return {
        inProgress: true,
        fileName: action.name,
        isFromStorage: true
    };
}
