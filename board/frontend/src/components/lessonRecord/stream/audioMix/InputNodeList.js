import InputNode from './InputNode';
import _ from 'lodash';

export default class InputNodeList {

    static empty() {
        return new InputNodeList([]);
    }

    static fromStreams(audioContext, streamList) {
        const nodeList = streamList.map(stream => new InputNode(audioContext, stream));
        return new InputNodeList(nodeList);
    }

    constructor(nodeList) {
        this.nodeList = nodeList;
    }

    append(other) {
        this.nodeList = [...this.nodeList, ...other.nodeList];
    }

    pullByStreams(streamList) {
        const dirtyNodeList = streamList.map(stream => this.nodeList.find(input => input.stream === stream));
        this.nodeList = _.difference(this.nodeList, dirtyNodeList);

        return new InputNodeList(dirtyNodeList);
    }

    connect(output) {
        this.nodeList.forEach(input => input.connect(output));
    }

    disconnect(output) {
        this.nodeList.forEach(input => input.disconnect(output));
    }

    dispose() {
        this.nodeList.forEach(input => input.dispose());
    }
}
