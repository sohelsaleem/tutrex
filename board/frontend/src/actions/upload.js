export const UPLOAD_DOCUMENT_FILE = 'document/UPLOAD_DOCUMENT_FILE';
export const UPLOAD_DOCUMENT_FILE_PROGRESS = 'document/UPLOAD_DOCUMENT_FILE_PROGRESS';
export const UPLOAD_DOCUMENT_FILE_SUCCESS = 'document/UPLOAD_DOCUMENT_FILE_SUCCESS';
export const UPLOAD_DOCUMENT_FILE_CANCEL = 'document/UPLOAD_DOCUMENT_FILE_CANCEL';
export const UPLOAD_DOCUMENT_FILE_FAILURE = 'document/UPLOAD_DOCUMENT_FILE_FAILURE';

export const UPLOAD_IMAGE_FILE = 'image/UPLOAD_IMAGE_FILE';
export const UPLOAD_IMAGE_FILE_PROGRESS = 'image/UPLOAD_IMAGE_FILE_PROGRESS';
export const UPLOAD_IMAGE_FILE_SUCCESS = 'image/UPLOAD_IMAGE_FILE_SUCCESS';
export const UPLOAD_IMAGE_FILE_CANCEL = 'image/UPLOAD_IMAGE_FILE_CANCEL';
export const UPLOAD_IMAGE_FILE_FAILURE = 'image/UPLOAD_IMAGE_FILE_FAILURE';

export const UPLOAD_FILE = 'file/UPLOAD_FILE';
export const UPLOAD_FILE_PROGRESS = 'file/UPLOAD_FILE_PROGRESS';
export const UPLOAD_FILE_SUCCESS = 'file/UPLOAD_FILE_SUCCESS';
export const UPLOAD_FILE_CANCEL = 'file/UPLOAD_FILE_CANCEL';
export const UPLOAD_FILE_FAILURE = 'file/UPLOAD_FILE_FAILURE';

export const UPLOAD_FILE_FROM_STORAGE = 'file/UPLOAD_FILE_FROM_STORAGE';
export const UPLOAD_FILE_FROM_STORAGE_SUCCESS = 'file/UPLOAD_FILE_FROM_STORAGE_SUCCESS';
export const UPLOAD_FILE_FROM_STORAGE_FAIL = 'file/UPLOAD_FILE_FROM_STORAGE_FAIL';

export const UPLOAD_IMAGE_FILE_FROM_STORAGE = 'image/UPLOAD_IMAGE_FILE_FROM_STORAGE';
export const UPLOAD_IMAGE_FILE_FROM_STORAGE_SUCCESS = 'image/UPLOAD_IMAGE_FILE_FROM_STORAGE_SUCCESS';
export const UPLOAD_IMAGE_FILE_FROM_STORAGE_FAIL = 'image/UPLOAD_IMAGE_FILE_FROM_STORAGE_FAIL';

export const UPLOAD_DOCUMENT_FILE_FROM_STORAGE = 'image/UPLOAD_DOCUMENT_FILE_FROM_STORAGE';
export const UPLOAD_DOCUMENT_FILE_FROM_STORAGE_SUCCESS = 'image/UPLOAD_DOCUMENT_FILE_FROM_STORAGE_SUCCESS';
export const UPLOAD_DOCUMENT_FILE_FROM_STORAGE_FAIL = 'image/UPLOAD_DOCUMENT_FILE_FROM_STORAGE_FAIL';

export const CANCEL_UPLOADING = 'upload/CANCEL_UPLOADING';

export function uploadDocumentFile(file, requestId) {
    return {
        type: UPLOAD_DOCUMENT_FILE,
        types: [
            UPLOAD_DOCUMENT_FILE_PROGRESS,
            UPLOAD_DOCUMENT_FILE_SUCCESS,
            UPLOAD_DOCUMENT_FILE_CANCEL,
            UPLOAD_DOCUMENT_FILE_FAILURE
        ],
        socketUpload: {
            event: 'upload:document',
            body: {
                name: file.name
            },
            file,
            requestId
        },
        file
    };
}

export function uploadImageFile(file, requestId) {
    return {
        type: UPLOAD_IMAGE_FILE,
        types: [
            UPLOAD_IMAGE_FILE_PROGRESS,
            UPLOAD_IMAGE_FILE_SUCCESS,
            UPLOAD_IMAGE_FILE_CANCEL,
            UPLOAD_IMAGE_FILE_FAILURE
        ],
        socketUpload: {
            event: 'upload:image',
            body: {
                name: file.name
            },
            file,
            requestId
        },
        file
    };
}

export function uploadFile(file, requestId) {
    return {
        type: UPLOAD_FILE,
        types: [
            UPLOAD_FILE_PROGRESS,
            UPLOAD_FILE_SUCCESS,
            UPLOAD_FILE_CANCEL,
            UPLOAD_FILE_FAILURE
        ],
        socketUpload: {
            event: 'upload:file',
            body: {
                name: file.name
            },
            file,
            requestId
        },
        file
    };
}

export function cancelUploading(requestId) {
    return {
        type: CANCEL_UPLOADING,
        socketUpload: {
            cancel: true,
            requestId
        }
    };
}

export function uploadImageFromStorage(link, name) {
    return {
        types: [UPLOAD_IMAGE_FILE_FROM_STORAGE, UPLOAD_IMAGE_FILE_FROM_STORAGE_SUCCESS, UPLOAD_IMAGE_FILE_FROM_STORAGE_FAIL],
        socketRequest: {
            event: 'storage:upload:image',
            body: {
                link, name
            }
        },
        link, name
    };
}

export function uploadDocumentFromStorage(link, name) {
    return {
        types: [UPLOAD_DOCUMENT_FILE_FROM_STORAGE, UPLOAD_DOCUMENT_FILE_FROM_STORAGE_SUCCESS, UPLOAD_DOCUMENT_FILE_FROM_STORAGE_FAIL],
        socketRequest: {
            event: 'storage:upload:document',
            body: {
                link, name
            }
        },
        link, name
    };
}

export function uploadFileFromStorage(link, name) {
    return {
        types: [UPLOAD_FILE_FROM_STORAGE, UPLOAD_FILE_FROM_STORAGE_SUCCESS, UPLOAD_FILE_FROM_STORAGE_FAIL],
        socketRequest: {
            event: 'storage:upload:file',
            body: {
                link, name
            }
        },
        link, name
    };
}

export function cancelFileUploading(requestId) {
    return {
        type: UPLOAD_FILE_CANCEL,
        socketUpload: {
            cancel: true,
            requestId
        }
    };
}
