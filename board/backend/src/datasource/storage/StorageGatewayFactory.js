'use strict';

module.exports = function() {
    if (config.simpleStorageApi)
        return require('./SimpleStorageGateway');

    return require('./StorageGateway');
};
