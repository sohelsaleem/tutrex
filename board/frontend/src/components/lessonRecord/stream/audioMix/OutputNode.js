import AudioNode from './AudioNode';

export default class OutputNode extends AudioNode {

    constructor(audioContext) {
        super(audioContext);
        this.destination = this.audioContext.createMediaStreamDestination();
    }

    getFirst() {
        return this.destination;
    }

    getLast() {
        return this.destination;
    }

    dispose() {
        this.destination = null;
    }

    getOutputTrack() {
        return this.destination.stream.getAudioTracks()[0];
    }
}
