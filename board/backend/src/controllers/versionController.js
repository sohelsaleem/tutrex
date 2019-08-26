'use strict';

const packageJSON = require('../../package.json');

module.exports = function (listenMessage) {
    listenMessage('version:request', getVersion);
};

function* getVersion(client, message, responseChannel) {
    responseChannel.sendAnswer({
        version: packageJSON.version
    });
}
