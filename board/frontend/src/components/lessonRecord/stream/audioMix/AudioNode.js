
export default class AudioNode {

    constructor(audioContext) {
        this.audioContext = audioContext;
    }

    getFirst() {

    }

    getLast() {

    }

    connect(output) {
        this.getLast().connect(output.getFirst());
    }

    disconnect(output) {
        this.getLast().disconnect(output.getFirst());
    }

    dispose() {

    }
}