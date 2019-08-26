import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

import Logo from './Logo';
import StrokeFillContainer from 'containers/whiteboard/StrokeFillContainer';
import Sharing from './Sharing';
import VideoFileButton from './VideoFileButton';
import RecordingToggle from './RecordingToggle';
import UploadDocumentContainer from 'containers/header/UploadDocumentContainer';
import UploadImageContainer from 'containers/header/UploadImageContainer';
import ExitButtonContainer from 'containers/header/ExitButtonContainer';
import TimeLeftLabelContainer from 'containers/header/TimeLeftLabelContainer';
import PollButton from './Poll/PollButton';

import {checkAccess} from 'domain/Capabilities';

import styles from './Header.scss';

export default class Header extends Component {
    static propTypes = {
        user: PropTypes.object,
        room: PropTypes.object,
        fullScreenEnabled: PropTypes.bool,
        screenSharingEnabled: PropTypes.bool,
        isRecording: PropTypes.bool,
        isInterruptedRecording: PropTypes.bool,
        onPressByScreenSharing: PropTypes.func.isRequired,
        onStartRecording: PropTypes.func.isRequired,
        onStopRecording: PropTypes.func.isRequired,
        onOpenPollModal: PropTypes.func.isRequired,
        isHeaderExpanded: PropTypes.bool,
        onToggleHeader: PropTypes.func.isRequired
    };

    handleScreenSharingPressed() {
        const {screenSharingEnabled, onPressByScreenSharing} = this.props;
        if (!screenSharingEnabled) {
            onPressByScreenSharing();
        }
    };

    render() {
        const {
            user,
            fullScreenEnabled,
            room,
            screenSharingEnabled,
            isHeaderExpanded,
            onToggleHeader
        } = this.props;

        const canDraw = checkAccess(user).canUseWhiteboard();
        const insideContainerClassname = classnames(styles.insideContainer, {
            [styles.insideContainerExpanded]: isHeaderExpanded,
            [styles.insideContainerWithTools]: canDraw
        });

        if (fullScreenEnabled) return null;

        return (
            <div className={styles.container}>
                <div className={insideContainerClassname}>
                    <Logo classroomLogo={room.classroomLogo}/>

                    {canDraw && <StrokeFillContainer enabled={!screenSharingEnabled}/>}

                    <div className={styles.spacer}/>

                    {canDraw && this.renderPresenterControls()}

                    <div className={styles.finishLessonContainer}>
                        <TimeLeftLabelContainer/>
                        <ExitButtonContainer/>
                    </div>
                </div>
                {canDraw && <div className={styles.toggleHeader} onClick={onToggleHeader}/>}
            </div>
        );
    }

    renderPresenterControls() {
        const {
            user,
            room,
            screenSharingEnabled,
            isRecording,
            isInterruptedRecording,
            onStartRecording,
            onStopRecording,
            onOpenPollModal
        } = this.props;

        const isFilesSharingAvailable = !room.isFilesSharingNotAvailable && !screenSharingEnabled;
        const screenShareClassname = classnames(styles.screenShareButton, {
            [styles.enabled]: !screenSharingEnabled
        });
        const isRecordingAvailable = user.isTeacher && room.canRecordClass;

        return (
            <div className={styles.presenterControls}>
                <div className={screenShareClassname}
                     onClick={::this.handleScreenSharingPressed}/>
                <VideoFileButton enabled={!screenSharingEnabled}/>
                <UploadDocumentContainer enabled={isFilesSharingAvailable}/>
                <UploadImageContainer enabled={isFilesSharingAvailable}/>
                <PollButton onButtonClick={onOpenPollModal} enabled={!screenSharingEnabled}/>

                <div className={styles.spacer}></div>

                {isRecordingAvailable && <RecordingToggle isRecording={isRecording}
                                                          onStartRecording={onStartRecording}
                                                          onStopRecording={onStopRecording}
                                                          isInterruptedRecording={isInterruptedRecording}/>}
                <Sharing room={room}/>
            </div>
        );
    }
}
