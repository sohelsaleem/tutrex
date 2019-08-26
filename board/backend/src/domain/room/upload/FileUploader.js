'use strict';

const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const storageResourcesRegistry = require('../storageResourcesRegistry');
const EventEmitter = require('events').EventEmitter;
const promisify = require('es6-promisify');
const mkdirp = promisify(require('mkdirp'));
const request = require('request');
const fileTypes = require('./uploadedFileTypes');

class FileUploader extends EventEmitter {
    constructor(room, fileName, fileType) {
        super();
        this.folderResource = fileType === fileTypes.IMAGE ?
            storageResourcesRegistry.image(room.id) :
            storageResourcesRegistry.file(room.id);

        const extension = path.extname(fileName);
        this.resource = this._makeResource(extension);

        this.fileStream = null;
        this.stream = null;
        this.link = null;
        this.streamCancelled = false;
    }

    _makeResource(extension) {
        return this.folderResource.join(shortid.generate() + extension);
    }

    upload(source, isLink) {
        if (isLink) {
            this.link = source;
        } else {
            this.stream = source;
        }

        const folderPath = this.folderResource.getPath();

        mkdirp(folderPath, {mode: '0777'})
            .then(() => this.doUpload());

        return this;
    }

    doUpload() {
        if (!this.stream && this.link)
            this.doUploadFromStorage();

        this.fileStream = fs.createWriteStream(this.resource.getPath());

        this.stream.pipe(this.fileStream);

        this.stream.once('end', () => {
            this.fileStream = null;
            this.finishTask();
        });
        this.stream.once('error', error => this.failTask(error));
    }

    doUploadFromStorage() {
        this.fileStream = fs.createWriteStream(this.resource.getPath());
        request.get(this.link)
            .on('response', res => {
                res.pipe(this.fileStream);

                res.on('end', () => {
                    this.fileStream = null;
                    this.finishTask();
                });
            });
    }

    finishTask() {
        this.emit('finish', this.resource.getURL());
        this.dispose();
    }

    failTask(error) {
        console.log(error);
        this.emit('error', error);
        this.dispose();
    }

    cancel() {
        this.cancelSaveStream()
            .then(() => {
                this.emit('cancel');
                this.dispose();
            });
    }

    cancelSaveStream() {
        if (!this.fileStream)
            return Promise.resolve();

        return new Promise(resolve => {
            this.stream.unpipe(this.fileStream);
            this.streamCancelled = true;
            this.stream.end();
            this.fileStream.end();
            resolve();
        })
    }

    dispose() {
        this.stream.removeAllListeners();
        this.emit('end');
    }
}

module.exports = FileUploader;
