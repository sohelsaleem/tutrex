const extensionId = 'ajhifddimkapgcifgcodmmfdlknahffk';
module.exports = {
    socketURL: 'wss://learnium.fora-soft.com:27103',
    extensions: {
        chrome: {
            extensionId: extensionId,
            link: `https://chrome.google.com/webstore/detail/${extensionId}`,
            extensionsLink: 'chrome://extensions/',
            getSourceId: 'https://www.webrtc-experiment.com/getSourceId/'
        }
    }
};
