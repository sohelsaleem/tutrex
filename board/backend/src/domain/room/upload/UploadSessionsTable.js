'use strict';

class UploadSessionsTable {
    constructor() {
        this.table = {};
    }

    put(id, uploadSession) {
        this.table[id] = uploadSession;
    }

    remove(id) {
        delete this.table[id];
    }

    find(id) {
        return this.table[id];
    }
}

module.exports = new UploadSessionsTable();