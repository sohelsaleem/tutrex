'use strict';

const request = require('request');
const urlBuilder = require('../../domain/util/urlBuilder');

module.exports = {
    apiRequest,
    makeApiRequest
};

function apiRequest(options) {
    return makeApiRequest(options).next();
}

function* makeApiRequest(options) {
    const url = urlBuilder(config.apiURL, options.relativeUrl);
    delete options.relativeUrl;

    const newOptions = Object.assign(options, {url: url});

    const result = yield makeRequest(newOptions);
    result.body = JSON.parse(result.body);
    return result;
}

function makeRequest(options) {
    const url = options.url;
    const method = options.method;
    const parameters = options.parameters;

    const getRequestOptions = {
        qs: parameters
    };
    const postRequestOptions = {form: parameters};

    const commonOptions = {
        url,
        method
    };

    const newOptions = (method === 'get')
        ? Object.assign(commonOptions, getRequestOptions)
        : Object.assign(commonOptions, postRequestOptions);

    return new Promise((resolve, reject) => {
        request(newOptions, (error, response, body) => {
            if (error)
                return reject(error);

            logResponse(url, response.statusCode, body);

            resolve({response, body});
        });
    });
}

function logResponse(url, statusCode, body) {
    const isInternalServerError = statusCode === 500;

    if (isInternalServerError)
        logger.debug('========= Start Internal Server Error =========');

    logger.debug('request:', url, ', response:', statusCode, body);

    if (isInternalServerError)
        logger.debug('========= End Internal Server Error =========');
}