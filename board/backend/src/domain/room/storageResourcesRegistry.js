'use strict';

const StorageResource = require('./StorageResource');

const roomsResource = new StorageResource('rooms');

module.exports = {
    room(roomId) {
        return roomsResource.join(String(roomId));
    },

    document(roomId) {
        return this.room(roomId)
            .join('documents');
    },

    image(roomId) {
        return this.room(roomId)
            .join('images');
    },

    record(roomId) {
        return this.room(roomId)
            .join('records');
    },

    file(roomId) {
        return this.room(roomId)
            .join('file');
    }
};
