import {
    UPLOAD_DOCUMENT_FILE,
    UPLOAD_DOCUMENT_FILE_PROGRESS,
    UPLOAD_DOCUMENT_FILE_SUCCESS,
    UPLOAD_DOCUMENT_FILE_CANCEL,
    UPLOAD_DOCUMENT_FILE_FAILURE,

    UPLOAD_DOCUMENT_FILE_FROM_STORAGE,
    UPLOAD_DOCUMENT_FILE_FROM_STORAGE_FAIL,
    UPLOAD_DOCUMENT_FILE_FROM_STORAGE_SUCCESS
} from 'actions/upload';

const initialState = {
    inProgress: false,
    progress: 0,
    fileName: '',
    error: null
};

const actionReducers = {
    [UPLOAD_DOCUMENT_FILE]: uploadFile,
    [UPLOAD_DOCUMENT_FILE_PROGRESS]: updateUploadProgress,
    [UPLOAD_DOCUMENT_FILE_CANCEL]: cancelUploading,
    [UPLOAD_DOCUMENT_FILE_SUCCESS]: finishUpload,
    [UPLOAD_DOCUMENT_FILE_FAILURE]: failUpload,
    [UPLOAD_DOCUMENT_FILE_FROM_STORAGE]: uploadFromStorage,
    [UPLOAD_DOCUMENT_FILE_FROM_STORAGE_SUCCESS]: finishUpload,
    [UPLOAD_DOCUMENT_FILE_FROM_STORAGE_FAIL]: failUpload
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
        ...state,
        inProgress: true,
        fileName,
        error: null
    };
}

function updateUploadProgress(state, action) {
    return {
        ...state,
        progress: action.progress
    };
}

function finishUpload(state, action) {
    return {
        ...state,
        inProgress: false
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
    const fileName = action.name;

    return {
        inProgress: true,
        fileName,
        isFromStorage: true
    };
}
