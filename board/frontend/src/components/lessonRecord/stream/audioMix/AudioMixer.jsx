import React, {Component, PropTypes} from 'react';
import InputNodeList from './InputNodeList';
import OutputNode from './OutputNode';
import _ from 'lodash';
import {getAudioContext} from '../../../../sources/AudioContext';

export default class AudioMixer extends Component {
    static propTypes = {
        sources: PropTypes.object.isRequired,
        onTrack: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.startMixAudios();
    }

    startMixAudios() {
        this.audioStreams = this.getAudioStreams();
        this.mixAudios();
    }

    getAudioStreams() {
        return this.props.sources.audioStreams
            .map(s => s.stream);
    }

    mixAudios() {
        const audioContext = getAudioContext();

        this.inputNodeList = InputNodeList.fromStreams(audioContext, this.audioStreams);
        this.outputNode = new OutputNode(audioContext);

        this.inputNodeList.connect(this.outputNode);

        this.props.onTrack(this.outputNode.getOutputTrack());
    }

    componentDidUpdate(prevProps) {
        if (prevProps.sources !== this.props.sources)
            this.reconnectAudioToMixer();
    }

    reconnectAudioToMixer = () => {
        const nextAudioStreams = this.getAudioStreams();

        this.disconnectDirtyStreams(nextAudioStreams);
        this.connectNewStreams(nextAudioStreams);

        this.audioStreams = nextAudioStreams;
    };

    disconnectDirtyStreams(nextAudioStreams) {
        const removingStreams = _.difference(this.audioStreams, nextAudioStreams);

        const dirtyInputNodeList = this.inputNodeList.pullByStreams(removingStreams);
        dirtyInputNodeList.disconnect(this.outputNode);
        dirtyInputNodeList.dispose();
    }

    connectNewStreams(nextAudioStreams) {
        const addingStreams = _.difference(nextAudioStreams, this.audioStreams);

        const additionalInputNodeList = InputNodeList.fromStreams(getAudioContext(), addingStreams);
        additionalInputNodeList.connect(this.outputNode);
        this.inputNodeList.append(additionalInputNodeList);
    }

    componentWillUnmount() {
        this.stopMixAudios();
    }

    stopMixAudios() {
        if (this.outputNode) {
            this.inputNodeList.disconnect(this.outputNode);
            this.outputNode.dispose();
        }

        this.inputNodeList.dispose();
    }

    render() {
        return null;
    }
}
