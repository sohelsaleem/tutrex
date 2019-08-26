'use strict';

class RecordSessionsTable {
    constructor() {
        this.table = {};
    }

    put(id, recordSession) {
        this.table[id] = recordSession;
    }

    remove(id) {
        delete this.table[id];
    }

    find(id) {
        return this.table[id];
    }
}

module.exports = new RecordSessionsTable();