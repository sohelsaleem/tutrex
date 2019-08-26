import React, {Component, PropTypes} from 'react';

import RecordSources from './stream/RecordSources';
import RecordCanvas from './stream/videoDraw/RecordCanvas';
import AudioMixer from './stream/audioMix/AudioMixer';
import RecordStream from './stream/RecordStream';
import StreamRecorder from './StreamRecorder';

import {StreamTypes} from 'helpers/videoChat/VideoChatUtils';

export default class LessonRecord extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        chatItemList: PropTypes.array,
        streams: PropTypes.array.isRequired,
        attendeeList: PropTypes.array,
        isPresentationMode: PropTypes.bool.isRequired,
        onRequestRecordingState: PropTypes.func.isRequired,
        onStartRecordLesson: PropTypes.func.isRequired,
        onUploadRecordChunk: PropTypes.func.isRequired,
        onConsumeRecordChunk: PropTypes.func.isRequired,
        onStopRecordLesson: PropTypes.func.isRequired,
        isRecording: PropTypes.bool,
        isInterruptedRecording: PropTypes.bool
    };

    state = {
        recordSources: null,
        recordVideoTrack: null,
        recordAudioTrack: null,
        recordStream: null,
        chatItemList: [],
        attendeeList: []
    };

    componentDidMount() {
        const {onRequestRecordingState} = this.props;
        onRequestRecordingState();
    }

    render() {
        const {
            streams,
            attendeeList,
            chatItemList,
            user,
            consumingChunks,
            onStartRecordLesson,
            onUploadRecordChunk,
            onConsumeRecordChunk,
            onStopRecordLesson,
            isRecording
        } = this.props;

        const {
            recordSources,
            recordVideoTrack,
            recordAudioTrack,
            recordStream
        } = this.state;

        const webinarMode = this.getWebinarMode();

        return (
            <div>
                <RecordSources user={user}
                               streams={streams}
                               chatItemList={chatItemList}
                               attendeeList={attendeeList}
                               onChange={this.updateSources}/>

                {recordSources && <RecordCanvas webinarMode={webinarMode}
                                                sources={recordSources}
                                                onTrack={this.updateVideoTrack}/>}

                {recordSources && <AudioMixer sources={recordSources}
                                              onTrack={this.updateAudioTrack}/>}

                <RecordStream videoTrack={recordVideoTrack}
                              audioTrack={recordAudioTrack}
                              onStream={this.updateStream}/>

                {recordStream && <StreamRecorder stream={recordStream}
                                                 consumingChunks={consumingChunks}
                                                 onStart={onStartRecordLesson}
                                                 onChunk={onUploadRecordChunk}
                                                 onChunkConsumed={onConsumeRecordChunk}
                                                 onStop={onStopRecordLesson}
                                                 isRecording={isRecording}/>}
            </div>
        );
    }

    getWebinarMode() {
        const {isPresentationMode, streams} = this.props;

        if (!isPresentationMode)
            return 'conference';

        if (streams.some(s => s.streamType === StreamTypes.SCREEN))
            return 'screensharing';

        return 'board';
    }

    updateSources = recordSources => {
        this.setState({recordSources});
    };

    updateVideoTrack = recordVideoTrack => {
        this.setState({recordVideoTrack});
    };

    updateAudioTrack = recordAudioTrack => {
        this.setState({recordAudioTrack});
    };

    updateStream = recordStream => {
        this.setState({recordStream});
    };
}
