'use strict';

const fs = require('fs');
const configPath = process.env.CONFIG || '/etc/tutrex/config.json';

module.exports = function loadExternalConfig() {
    let externalConfig = {};

    try {
        externalConfig = JSON.parse(fs.readFileSync(configPath));
    }
    catch (error) {
        logger.error('Problem with config:', configPath, error);
        process.exit(1);
    }

    return externalConfig;
};
