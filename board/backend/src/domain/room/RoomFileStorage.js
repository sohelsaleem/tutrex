'use strict';

const AsyncEventEmitter = require('../AsyncEventEmitter');
const storageResourcesRegistry = require('./storageResourcesRegistry');

const promisify = require('es6-promisify');
const removeDirectory = promisify(require('fs-extra').remove);

class RoomFileStorage extends AsyncEventEmitter {
    constructor(roomId) {
        super();
        this.roomId = roomId;
    }

    dispose() {
        // const roomStorageResource = storageResourcesRegistry.room(this.roomId);
        // return removeDirectory(roomStorageResource.getPath());
    }
}

module.exports = RoomFileStorage;
