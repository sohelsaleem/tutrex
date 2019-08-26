import {isFirefox, isChrome} from 'helpers/BrowserDetector';

import config from '../../config';


class ScreenShareUtils {
    requestScreen() {
        if (isChrome()) {
            return this.isChromeExtensionInstalled()
                .then(this.captureMediaForChrome.bind(this))
                .catch(this.onChromeExtensionNotInstalled.bind(this));
        } else if (isFirefox()) {
            return this.captureMediaForFirefox();
        } else {
            throw new Error(Errors.SCREEN_UNAVAILABLE);
        }
    }

    isChromeExtensionInstalled() {
        return new Promise((resolve, reject) => {
            const image = document.createElement('img');
            image.src = 'chrome-extension://' + config.extensions.chrome.extensionId + '/icon.png';
            image.onload = () => {
                resolve();
            };
            image.onerror = () => {
                reject();
            };
        });
    }

    captureMediaForChrome() {
        return this.loadChromeExtensionFrame()
            .then(this.onLoadedChromeExtension.bind(this))
            .then(this.onUserChosenWindow.bind(this))
            .catch(() => {
                throw new Error(Errors.SCREEN_UNAVAILABLE);
            });
    }

    loadChromeExtensionFrame() {
        return new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.onload = () => {
                resolve(iframe);
            };
            iframe.onError = (err) => {
                reject(err);
            };
            /** TODO replace this when upload extension to store
             dont forget to replace id of extension in getSourceId and config
             iframe.src = location.protocol + '//' + location.host + '/getSourceId.html'; */
            iframe.src = config.extensions.chrome.getSourceId;
            (document.body || document.documentElement).appendChild(iframe);
            iframe.style.display = 'none';
        });
    }

    onLoadedChromeExtension(iframe) {
        return new Promise((resolve, reject) => {
            iframe.contentWindow.postMessage({
                captureSourceId: true
            }, '*');
            window.addEventListener('message', (event) => {
                if (event.data.exCaptured) {
                    return;
                }
                if (event.data && event.data.chromeExtensionStatus === 'installed-disabled') {
                    reject();
                } else {
                    resolve(event);
                }
            });
        });
    }

    onUserChosenWindow(event) {
        if (!event.data || !event.data.chromeMediaSourceId) {
            return null;
        }

        const sourceId = event.data.chromeMediaSourceId;

        if (sourceId === 'PermissionDeniedError') {
            return null;
        }
        const mediaConstraints = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    maxWidth: screen.width > 1920 ? screen.width : 1920,
                    maxHeight: screen.height > 1080 ? screen.height : 1080,
                    chromeMediaSourceId: sourceId
                },
                optional: []
            }
        };

        return navigator.mediaDevices.getUserMedia(mediaConstraints);
    }

    onChromeExtensionNotInstalled = () => {
        throw new Error(Errors.CHROME_NOT_INSTALLED);
    };

    captureMediaForFirefox = () => {
        const mediaConstraints = {
            audio: false,
            video: {
                mozMediaSource: 'window',
                mediaSource: 'window',
                maxWidth: screen.width > 1920 ? screen.width : 1920,
                maxHeight: screen.height > 1080 ? screen.height : 1080
            }
        };

        return navigator.mediaDevices.getUserMedia(mediaConstraints);
    };
}

export const Errors = {
    CHROME_NOT_INSTALLED: 'onChromeExtensionNotInstalled',
    SCREEN_UNAVAILABLE: 'screenUnavailable'
};

export default new ScreenShareUtils();

