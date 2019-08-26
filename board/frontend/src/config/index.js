const configuration = process.env.BUILD_CONFIG;

const defaultConfig = require('./default');
const config = require(`./config_${configuration}`);

module.exports = Object.assign(defaultConfig, config);
