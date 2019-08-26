'use strict';

const logger = require('./datasource/log/logger');
global.logger = logger;

const config = require('./config');
global.config = config;

const packageJSON = require('../package.json');
logger.info(`${packageJSON.description}, version: ${packageJSON.version}`);

require('./controllers/server').run();

process.on('uncaughtException', function (err) {
    logger.error(err.message);
    logger.error(err.stack);
});
