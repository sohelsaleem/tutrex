export function hasFileNotSpecifiedType(file, mimeTypes) {
    const fileType = getFileType(file).toLowerCase();
    return mimeTypes.every(mimeType => mimeType !== fileType);
}

function getFileType(file) {
    return file.type && file.type.length > 0 ?
        file.type :
        file.name.split('.').pop();
}

export function isFileOversized(file, size) {
    return file.size > size;
}
