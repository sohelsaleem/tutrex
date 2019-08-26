'use strict';

const fs = require('fs');

module.exports = function () {
    checkConfig();

    const server = createServer();
    return server.listen(config.port);
};

function checkConfig() {
    if (!isConfigCorrect()) {
        logger.error('Cannot start SSL server, please check configuration');
        process.exit(1);
    }
}

function isConfigCorrect() {
    if (config.noSSL)
        return true;

    const necessaryFiles = [
        config.sslKey,
        config.sslCert,
        config.sslCa
    ];

    return necessaryFiles.every(path => fs.existsSync(path));
}

function createServer() {
    if (needSSL())
        return createSslServer();

    return createSimpleServer();

}

function needSSL() {
    return !config.noSSL;
}

function createSslServer() {
    return require('https').createServer({
        key: fs.readFileSync(config.sslKey, 'utf8'),
        cert: fs.readFileSync(config.sslCert, 'utf8'),
        ca: fs.readFileSync(config.sslCa, 'utf8')
    });
}

function createSimpleServer() {
    return require('http').createServer();
}