'use strict';

const Repository = require('../../domain/repository/Repository');

class MemoryRepository extends Repository {
    constructor() {
        super();
        this.table = {};
    }

    put(row) {
        if (!this.table[row.id])
            this.emit('added', row);

        this.table[row.id] = row;
    }

    removeById(id) {
        if (this.table[id])
            this.emit('removed', this.findById(id));

        delete this.table[id];
    }

    findById(id) {
        return this.table[id];
    }
}

module.exports = MemoryRepository;
