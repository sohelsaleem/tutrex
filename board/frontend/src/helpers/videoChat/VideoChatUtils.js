class VideoChatUtils {
    requestCamera(callback, errorCallback) {
        var mediaConstraints = {
            audio: true,
            video: true
        };
        navigator.mediaDevices.getUserMedia(mediaConstraints).then(callback).catch(errorCallback);
    }
}

export const StreamTypes = {
    CAMERA: 'camera',
    SCREEN: 'screen'
};

export default new VideoChatUtils();
