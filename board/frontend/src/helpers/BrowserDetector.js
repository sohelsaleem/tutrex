const detectBrowser = require('detect-browser');

export function isFirefox() {
    return detectBrowser.name === 'firefox';
}

export function isChrome() {
    return detectBrowser.name === 'chrome';
}
