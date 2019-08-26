import 'webrtc-adapter';

const servers = {
    iceServers: [
        {
            url: 'stun://stun2.l.google.com:19302'
        }
    ]
};

class WebRTCFactory {
    createPeerConnection() {
        return new RTCPeerConnection(servers);
    }
}

export default new WebRTCFactory();
