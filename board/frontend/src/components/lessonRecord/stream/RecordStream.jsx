import React, {Component, PropTypes} from 'react';

export default class RecordStream extends Component {
    static propTypes = {
        videoTrack: PropTypes.object,
        audioTrack: PropTypes.object,
        onStream: PropTypes.func.isRequired
    };

    componentDidUpdate(prevProps) {
        if (prevProps.videoTrack !== this.props.videoTrack)
            this.updateVideoTrack();

        if (prevProps.audioTrack !== this.props.audioTrack)
            this.updateAudioTrack();
    }

    updateVideoTrack() {
        if (!this.stream)
            return this.makeNewStream();

        this.stream.getVideoTracks().forEach(track => this.stream.removeTrack(track));
        this.stream.addTrack(this.props.videoTrack);
    }

    makeNewStream() {
        const {videoTrack, audioTrack, onStream} = this.props;

        this.stream = new MediaStream([videoTrack, audioTrack]);

        onStream(this.stream);
    }

    updateAudioTrack() {
        if (!this.stream)
            return this.makeNewStream();

        this.stream.getAudioTracks().forEach(track => this.stream.removeTrack(track));
        this.stream.addTrack(this.props.audioTrack);
    }

    componentWillUnmount() {
        if (!this.stream)
            return;
        
        this.stream.getTracks(track => track.stop());
    }

    render() {
        return null;
    }
}
