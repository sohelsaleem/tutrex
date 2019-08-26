'use strict';

const AsyncEventEmitter = require('../AsyncEventEmitter');

class Repository extends AsyncEventEmitter {
    constructor() {
        super();
    }

    put(row) {
        throw new Error('method <put> must be implemented');
    }

    removeById(id) {
        throw new Error('method <remove> must be implemented');
    }

    findById(id) {
        throw new Error('method <findById> must be implemented');
    }
}

module.exports = Repository;
