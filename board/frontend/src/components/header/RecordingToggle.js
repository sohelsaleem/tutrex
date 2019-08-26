import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

import ResumeRecordingDialog from 'components/header/ResumeRecordingDialog';

import styles from './RecordingToggle.scss';

export default class RecordingToggle extends Component{
    static propTypes = {
        isRecording: PropTypes.bool,
        isInterruptedRecording: PropTypes.bool,
        onStartRecording: PropTypes.func.isRequired,
        onStopRecording: PropTypes.func.isRequired
    };

    onClick() {
        const {isRecording, onStartRecording, onStopRecording} = this.props;

        if (isRecording)
            return onStopRecording();

        onStartRecording();
    }

    render() {
        const {isRecording, isInterruptedRecording, onStartRecording, onStopRecording} = this.props;
        const buttonClassname = classnames(
            styles.toggleRecordingButton,
            isRecording ? styles.stopRecordingButton : styles.startRecordingButton
        );

        return (
            <div className={styles.recordingButtonContainer} onClick={::this.onClick}>
                <div className={buttonClassname}></div>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
                {isInterruptedRecording && <ResumeRecordingDialog onResumeRecording={onStartRecording}
                                                                  onCancelRecording={onStopRecording}/>}
            </div>
        );
    }
}
