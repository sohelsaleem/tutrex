const extensionId = 'ajhifddimkapgcifgcodmmfdlknahffk';
module.exports = {
    socketURL: 'wss://tutrex.com:8190',
    extensions: {
        chrome: {
            extensionId: extensionId,
            link: `https://chrome.google.com/webstore/detail/${extensionId}`,
            extensionsLink: 'chrome://extensions/',
            getSourceId: 'https://www.webrtc-experiment.com/getSourceId/'
        }
    }
};
