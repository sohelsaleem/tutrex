import React, {Component, PropTypes} from 'react';
import uuid from 'node-uuid';

import {getAudioContext} from 'sources/AudioContext';

const mimeType = 'video/webm;codecs=vp8';
const CHUNK_DURATION = 3000;
const NOT_CONSUMED_CHUNK_MAX_COUNT = 3;

export default class StreamRecorder extends Component {
    static propTypes = {
        stream: PropTypes.object.isRequired,
        consumingChunks: PropTypes.array.isRequired,
        onStart: PropTypes.func.isRequired,
        onChunk: PropTypes.func.isRequired,
        onChunkConsumed: PropTypes.func.isRequired,
        onStop: PropTypes.func.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.isRecording && !this.recordId) {
            const audioContext = getAudioContext();
            audioContext.resume();
            return this.startRecord();
        }
        if (!nextProps.isRecording && this.recordId)
            this.stopRecord();
    }

    componentDidUpdate() {
        this.props.consumingChunks.forEach(this.consumeChunk);
    }

    startRecord() {
        const {stream, onStart} = this.props;

        this.recordId = uuid.v4();
        this.chunkOrdinal = 1;
        this.notConsumedChunks = new Set();

        this.netSpeedPaused = false;

        this.mediaRecorder = new MediaRecorder(stream, {mimeType});
        this.mediaRecorder.ondataavailable = this.handleChunk;
        this.mediaRecorder.onstop = this.handleStop;
        this.mediaRecorder.start(CHUNK_DURATION);

        onStart({
            recordId: this.recordId
        });
    }

    handleChunk = ({data}) => {
        const ordinal = this.generateChunkOrdinal();

        this.produceChunk(ordinal);
        this.emitChunk(data, ordinal);
    };

    generateChunkOrdinal() {
        return this.chunkOrdinal++;
    }

    produceChunk(ordinal) {
        this.notConsumedChunks.add(ordinal);

        // if (this.hasChunkOverflow()) {
        //     this.pauseBecauseNetSpeed();
        //     console.log('CHUNK OVERFLOW');
        // }
    }

    hasChunkOverflow() {
        return this.notConsumedChunks.size >= NOT_CONSUMED_CHUNK_MAX_COUNT;
    }

    pauseBecauseNetSpeed() {
        this.notConsumedChunks.clear();
        this.netSpeedPaused = true;
        this._pause();
    }

    _pause() {
        if (this.isMediaRecorderAlive()) {
            if (this.mediaRecorder.state === 'recording')
                this.mediaRecorder.pause();
        }
    }

    isMediaRecorderAlive() {
        return this.mediaRecorder && this.mediaRecorder.state !== 'inactive';
    }

    emitChunk(data, ordinal) {
        const blob = new Blob([data], {type: mimeType});

        this.props.onChunk({
            recordId: this.recordId,
            ordinal,
            blob
        });
    }

    handleStop = () => {
        this.mediaRecorder.ondataavailable = null;
        this.mediaRecorder.onstop = null;
        this.mediaRecorder = null;

        this.props.onStop({
            recordId: this.recordId
        });

        this.recordId = null;
        this.chunkOrdinal = 0;
        this.notConsumedChunks.clear();
    };

    consumeChunk = ordinal => {
        this.notConsumedChunks.delete(ordinal);
        this.props.onChunkConsumed(ordinal);

        if (!this.hasChunkOverflow())
            this.resumeBecauseNetSpeed();
    };

    resumeBecauseNetSpeed() {
        this.notConsumedChunks.clear();
        this.netSpeedPaused = false;
        this._resume();
    }

    _resume() {
        if (this.isPaused())
            return;

        if (this.isMediaRecorderAlive()) {
            if (this.mediaRecorder.state === 'paused')
                this.mediaRecorder.resume();
        }
    }

    isPaused() {
        return this.netSpeedPaused;
    }

    componentWillUnmount() {
        this.stopRecord();
    }

    stopRecord() {
        if (this.isMediaRecorderAlive())
            this.mediaRecorder.stop();
    }

    render() {
        return null;
    }
}
