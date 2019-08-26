'use strict';

const fs = require('fs');
const request = require('request');
const path = require('path');
const shortid = require('shortid');
const storageResourcesRegistry = require('../storageResourcesRegistry');
const EventEmitter = require('events').EventEmitter;
const promisify = require('es6-promisify');
const mkdirp = promisify(require('mkdirp'));

const convertToPdf = require('../../../datasource/convertation/convertToPdf');

class DocumentUploader extends EventEmitter {
    constructor(room, documentName) {
        super();
        this.documentFolderResource = storageResourcesRegistry.document(room.id);

        const extension = path.extname(documentName);
        this.documentResource = this._makeDocumentResource(extension);

        this.documentStream = null;
        this.documentLink = null;
        this.documentStreamCancelled = false;
        this.notConvertedDocumentResource = null;
        this.pdfConversionTask = null;
    }

    _makeDocumentResource(extension) {
        return this.documentFolderResource.join(shortid.generate() + extension);
    }

    upload(source, isLink) {
        if (isLink) {
            this.documentLink = source;
        } else {
            this.documentStream = source;
        }

        const folderPath = this.documentFolderResource.getPath();

        mkdirp(folderPath, {mode: '0777'})
            .then(() => this.doUpload());

        return this;
    }

    doUpload() {
        if(!this.documentStream && this.documentLink)
            return this.doUploadFromStorage();

        this.fileStream = fs.createWriteStream(this.documentResource.getPath());

        this.documentStream.pipe(this.fileStream);

        this.documentStream.once('end', () => {
            this.fileStream = null;

            if (!this.documentStreamCancelled)
                this.convert();
        });
        this.documentStream.once('error', error => this.failTask(error));
    }

    doUploadFromStorage(){
        this.fileStream = fs.createWriteStream(this.documentResource.getPath());
        request.get(this.documentLink)
            .on('response', res => {
                res.pipe(this.fileStream);

                res.on('end', () => {
                    this.fileStream = null;
                    this.convert();
                });
            });
    }

    convert() {
        if (this.documentResource.getExtension() === '.pdf')
            return this.finishTask();

        this.notConvertedDocumentResource = this.documentResource;
        this.documentResource = this._makeDocumentResource('.pdf');

        this.pdfConversionTask = convertToPdf(this.notConvertedDocumentResource.getPath(), this.documentResource.getPath())
            .once('finish', () => this.finishTask())
            .once('error', error => this.failTask(error));
    }

    finishTask() {
        this.emit('finish', this.documentResource.getURL());
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
                if (this.pdfConversionTask)
                    return this.pdfConversionTask.cancel();
            })
            .then(() => {
                this.emit('cancel');
                this.dispose();
            });
    }

    cancelSaveStream() {
        if (!this.fileStream)
            return Promise.resolve();

        return new Promise(resolve => {
            this.documentStream.unpipe(this.fileStream);

            // this.documentStream.once('unpipe', () => {
            this.documentStreamCancelled = true;
            this.documentStream.end();
            this.fileStream.end();
            resolve();
            // });
        })
    }

    dispose() {
        this.documentStream.removeAllListeners();

        if (this.pdfConversionTask)
            this.pdfConversionTask.removeAllListeners();

        this.emit('end');
    }
}

module.exports = DocumentUploader;
