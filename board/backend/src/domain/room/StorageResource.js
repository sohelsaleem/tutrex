'use strict';

const path = require('path');

const filesURL = config.filesURL.endsWith('/') ?
    config.filesURL.slice(0, -1) :
    config.filesURL;

class StorageResource {
    constructor(relativePath) {
        this.relativePath = relativePath;
    }

    getPath() {
        return path.join(config.filesPath, this.relativePath);
    }

    getParentFolderPath() {
        return path.dirname(this.getPath());
    }

    getFilename() {
        return path.parse(this.getPath()).base;
    }

    getExtension() {
        return path.parse(this.getPath()).ext;
    }

    getURL() {
        return filesURL + '/' + this.relativePath;
    }

    join(additionalPath) {
        const nextRelativePath = path.join(this.relativePath, additionalPath);
        return new StorageResource(nextRelativePath);
    }
}

module.exports = StorageResource;
