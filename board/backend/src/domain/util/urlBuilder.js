'use strict';

module.exports = function (baseURL, relativeURL) {
    const cleanBaseURL = trimEndCharacter(baseURL, '/');
    const cleanRelativeURL = trimStartCharacter(relativeURL, '/');

    return cleanBaseURL + '/' + cleanRelativeURL;
};

function trimEndCharacter(str, character) {
    if (!str.endsWith(character))
        return str;

    return str.slice(0, -1);
}

function trimStartCharacter(str, character) {
    if (!str.startsWith(character))
        return str;

    return str.slice(1);
}