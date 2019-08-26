const extensionId = 'ajhifddimkapgcifgcodmmfdlknahffk';
module.exports = {
    socketURL: 'wss://dev.learnium.fora-soft.com:27101',
    extensions: {
        chrome: {
            extensionId: extensionId,
            link: `https://chrome.google.com/webstore/detail/${extensionId}`,
            extensionsLink: 'chrome://extensions/',
            getSourceId: 'https://www.webrtc-experiment.com/getSourceId/'
        }
    }
};
