export const documentMimeTypes = [
    'application/pdf',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/vnd.oasis.opendocument.spreadsheet',
    'text/csv',
    'application/vnd.oasis.opendocument.text',
    'application/msword',
    'application/vnd.oasis.opendocument.presentation',
    'ppt',
    'pptx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pdf',
    'doc',
    'xls',
    'xlsx',
    'odt',
    'ods',
    'odp',
    'txt',
    'csv'
];

import {DOCUMENT_SIZE_MAX_SIZE} from '../../tuning';
import {hasFileNotSpecifiedType, isFileOversized} from './fileRestrictions';

export function hasFileNotDocumentType(file) {
    return hasFileNotSpecifiedType(file, documentMimeTypes);
}

export function isDocumentFileOversized(file) {
    return isFileOversized(file, DOCUMENT_SIZE_MAX_SIZE);
}
