'use strict';

module.exports = function() {
    if (config.simpleAuth)
        return require('./SimpleAuthGateway');

    return require('./ApiAuthGateway');
};
