export const imageMimeTypes = [
    'image/png',
    'image/jpeg',
    'image/pjpeg',
    'image/gif',
    'image/svg+xml',
    'png',
    'jpg',
    'gif',
    'pjpeg',
    'jpeg',
    'svg'
];

import {IMAGE_SIZE_MAX_SIZE} from '../../tuning';
import {hasFileNotSpecifiedType, isFileOversized} from './fileRestrictions';

export function hasFileNotImageType(file) {
    return hasFileNotSpecifiedType(file, imageMimeTypes);
}

export function isImageFileOversized(file) {
    return isFileOversized(file, IMAGE_SIZE_MAX_SIZE);
}

