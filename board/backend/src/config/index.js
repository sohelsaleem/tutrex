'use strict';

const CONFIGURATIONS = [
    'local'
];

const minimist = require ('minimist');
const argv = minimist(process.argv.slice(2), {});

const defaultConfig = require('./default');
const loadExternalConfig = require('./loadExternalConfig');

module.exports = loadConfig(argv.config);

function loadConfig(configurationName) {
    const config = requireConfig(configurationName);

    if (!config)
        return die('BAD --config ARGUMENT: ' + configurationName);

    return Object.assign(defaultConfig, config);
}

function die(message) {
    logger.error(message);
    logger.error('PROCESS TERMINATED');
    process.exit(1);
}

function requireConfig(configurationName) {
    if (!isRightConfiguration(configurationName))
        return loadExternalConfig();

    return require(`./config_${configurationName}`);
}

function isRightConfiguration(configurationName) {
    return CONFIGURATIONS.indexOf(configurationName) >= 0;
}
