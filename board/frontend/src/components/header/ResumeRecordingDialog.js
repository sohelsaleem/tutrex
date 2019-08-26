import React, {Component, PropTypes} from 'react';

import Dialog from 'components/common/Dialog';

import styles from 'components/header/ResumeRecordingDialog.scss';
import commonStyles from 'components/ComponentsTheme.scss';

export default class ResumeRecordingDialog extends Component {
    static propTypes = {
        onResumeRecording: PropTypes.func.isRequired,
        onCancelRecording: PropTypes.func.isRequired
    };

    render() {
        const {onCancelRecording, onResumeRecording} = this.props;

        return (
            <Dialog onClose={onCancelRecording}
                    title={'Lesson recording'}
                    containerClassName={styles.resumeRecordingDialog}>
                Would you like to resume recording?
                <div className={styles.buttonContainer}>
                    <button className={commonStyles.buttonGrey} onClick={onCancelRecording}>Cancel</button>
                    <button className={commonStyles.buttonBlue} onClick={onResumeRecording}>Resume recording</button>
                </div>
            </Dialog>
        );
    }
}
