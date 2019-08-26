'use strict';

const fs = require('fs');
const path = require('path');

const allControllers = fs.readdirSync(__dirname)
    .filter(fileName => fileName.match(/Controller\.js$/))
    .map(fileName => require(path.join(__dirname, fileName)));

module.exports = allControllers;
