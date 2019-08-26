'use strict';

const fs = require('fs');
const _ = require('lodash');

const promisify = require('es6-promisify');
const mkdirp = promisify(require('mkdirp'));
const unlink = promisify(require('fs').unlink);
const wrap = require('co').wrap;

const uuid = require('node-uuid');

const storageResourcesRegistry = require('../room/storageResourcesRegistry');
const repairVideoFile = require('../../datasource/convertation/repairVideoFile');
const promiseUtil = require('../util/promiseUtil');

const RoomNotifierGateway = require('../../datasource/roomNotifier/RoomNotifierGatewayFactory')();

class RecordSession {
    constructor(id, user, room) {
        this.id = id;
        this.user = user;
        this.room = room;

        this.recordResource = null;
        this.resultResource = null;

        this.fileStream = null;
        this.lastPipePromise = null;
    }

    initialize(room) {
        this.room = room;
        this.recordResource = this.generateRecordResource();

        this.lastPipePromise = mkdirp(this.recordResource.getParentFolderPath())
            .then(() => {
                this.fileStream = fs.createWriteStream(this.recordResource.getPath());
            });

        return this;
    }

    generateRecordResource() {
        return storageResourcesRegistry.record(this.room.id)
            .join(uuid.v4() + '.webm');
    }

    appendChunk(chunkStream) {
        const pipeLater = this._makePipeLater(chunkStream);
        this.lastPipePromise = this.lastPipePromise.then(pipeLater);

        return this.lastPipePromise;
    }

    _makePipeLater(chunkStream) {
        return () => new Promise((resolve, reject) => {
            chunkStream.once('end', resolve)
                .once('error', error => {
                    console.error(error);
                    resolve();
                })
                .pipe(this.fileStream, {end: false})
        });
    }

    stop() {
        logger.debug('RecordSession:stop', this.id);

        return this._stopUploading()
            .then(() => this.repairVideoFile())
            .then(() => this.ensureVideoFilePermissions())
            .then(() => this.dispatchResultVideo())
            .catch(e => console.log(e));
    }

    _stopUploading() {
        const callback = promiseUtil.makeCallback();

        this.lastPipePromise
            .then(() => {
                this.fileStream.end(error => {
                    if (error)
                        return callback(error);
                    callback();
                });
            });

        setTimeout(callback, 5000);

        return callback.promise;
    }

    repairVideoFile() {
        const inputPath = this.recordResource.getPath();

        this.resultResource = this.generateRecordResource();
        const outputPath = this.resultResource.getPath();

        return repairVideoFile(inputPath, outputPath)
            .promise()
            .then(() => unlink(inputPath));
    }

    ensureVideoFilePermissions() {
        const callback = promiseUtil.makeCallback();

        fs.chmod(this.resultResource.getParentFolderPath(), '0777', callback);

        return callback.promise;
    }

    dispatchResultVideo() {
        const addLessonRecord = wrap(RoomNotifierGateway.addLessonRecord);

        return addLessonRecord({
            roomId: this.room.id,
            userId: this.user.id,
            id: this.id,
            url: this.resultResource.getURL(),
            path: this.resultResource.getPath()
        });
    }
}

module.exports = RecordSession;
