'use strict';

const kurento = require('kurento-client');

let _kurentoPromise;

function getKurentoClient() {
    if (!_kurentoPromise) {
        _kurentoPromise = kurento(config.kurentoURL);
    }
    return _kurentoPromise;
}

module.exports = {
    getKurentoClient
};
