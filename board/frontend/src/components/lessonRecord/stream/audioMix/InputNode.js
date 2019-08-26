import AudioNode from './AudioNode';

export default class InputNode extends AudioNode {

    constructor(audioContext, stream) {
        super(audioContext);
        this.stream = stream;
        
        this.source = this.audioContext.createMediaStreamSource(stream);
    }

    getFirst() {
        return this.source;
    }

    getLast() {
        return this.source;
    }

    dispose() {
        this.source = null;
    }
}
