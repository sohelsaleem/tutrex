import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import VideoChatComponent from 'components/videoChat/VideoChatComponent';
import ChangeFullScreenModeButton from 'components/videoChat/ChangeFullScreenModeButton';
import InformationDialog from 'components/common/InformationDialog';

import VideoChatUtils, {StreamTypes} from 'helpers/videoChat/VideoChatUtils';

import {publishStream, unpublishStream, getVideoChatHistory} from 'actions/videoChat';
import {toggleBetweenWebinarOrPresentationMode, checkIsPresentationMode, confirmReturnToLesson} from 'actions/room';

const mapStateToProps = state => {
    const authInfo = state.room.authInfo;
    const myMediaState = authInfo && getMediaStateById(state, authInfo.user.id);
    const needStreamVideo = authInfo && (myMediaState.video || myMediaState.audio);
    const mediaStateVideo = authInfo && myMediaState.video;
    const mediaStateAudio = authInfo && myMediaState.audio;
    const userId = _.get(authInfo, 'user.id', -1);
    const isTeacher = _.get(authInfo, 'user.isTeacher', false);
    const firstLogin = _.get(authInfo, 'user.firstLogin', true);
    const showReturnToLessonDialog = state.room.showReturnToLessonDialog && !isTeacher && !firstLogin;
    return {
        userId,
        isTeacher,
        needStreamVideo,
        mediaStateVideo,
        mediaStateAudio,
        attendeeList: state.attendeeList.attendeeList || [],
        streams: state.videoChat.streams,
        isPresentationMode: state.room.isPresentationMode,
        showReturnToLessonDialog
    };
};

function getMediaStateById(state, id) {
    const user = state.attendeeList.attendeeList && state.attendeeList.attendeeList.find(user => user.id === id);
    return user ? user.mediaState : {};
}

const mapDispatchToProps = {
    publishStream,
    unpublishStream,
    getVideoChatHistory,
    onToggleBetweenWebinarOrPresentationMode: toggleBetweenWebinarOrPresentationMode,
    onCheckIsPresentationMode: checkIsPresentationMode,
    onConfirmReturnToLesson: confirmReturnToLesson
};

class VideoChatContainer extends Component {
    static propTypes = {
        needStreamVideo: PropTypes.bool,
        mediaStateVideo: PropTypes.bool,
        mediaStateAudio: PropTypes.bool,
        isTeacher: PropTypes.bool,
        streams: PropTypes.array,
        attendeeList: PropTypes.array,
        userId: PropTypes.number,
        publishStream: PropTypes.func.isRequired,
        unpublishStream: PropTypes.func.isRequired,
        getVideoChatHistory: PropTypes.func.isRequired,
        onToggleBetweenWebinarOrPresentationMode: PropTypes.func.isRequired,
        isPresentationMode: PropTypes.bool.isRequired,
        onCheckIsPresentationMode: PropTypes.func.isRequired,
        showReturnToLessonDialog: PropTypes.bool.isRequired,
        onConfirmReturnToLesson: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            showNotAccessCameraDialog: false
        };

        if (props.needStreamVideo) {
            VideoChatUtils.requestCamera(this.handleLocalStreamReceived.bind(this), this.handleLocalStreamNotReceived.bind(this));
        }
    }

    componentDidMount() {
        this.props.onCheckIsPresentationMode();
        this.props.getVideoChatHistory();
    }

    componentWillReceiveProps(props) {
        if (!this.props.needStreamVideo && props.needStreamVideo) {
            VideoChatUtils.requestCamera(this.handleLocalStreamReceived.bind(this), this.handleLocalStreamNotReceived.bind(this));
        }

        if (this.props.needStreamVideo && !props.needStreamVideo) {
            const {userId, unpublishStream} = this.props;
            unpublishStream(userId, StreamTypes.CAMERA);
        }

        if (this.props.mediaStateVideo != props.mediaStateVideo) {
            this.changeVideoEnabled(props.mediaStateVideo);
        }

        if (this.props.mediaStateAudio != props.mediaStateAudio) {
            this.changeAudioEnabled(props.mediaStateAudio);
        }
    }

    changeVideoEnabled(enabled) {
        const stream = this.getMyStream();
        if (!stream) return;

        stream.getVideoTracks().forEach(track => {
            track.enabled = enabled;
        });
    }

    changeAudioEnabled(enabled) {
        const stream = this.getMyStream();
        if (!stream) return;

        stream.getAudioTracks().forEach(track => {
            track.enabled = enabled;
        });
    }

    getMyStream() {
        const {streams, userId} = this.props;
        const streamData = streams.find((data) => data.userId == userId && data.streamType == StreamTypes.CAMERA);
        return streamData && streamData.stream;
    }

    handleLocalStreamReceived = (stream) => {
        const {userId, publishStream} = this.props;
        publishStream(userId, StreamTypes.CAMERA, stream);

        this.changeVideoEnabled(this.props.mediaStateVideo);
        this.changeAudioEnabled(this.props.mediaStateAudio);
    };

    handleLocalStreamNotReceived = error => {
        console.error(error);
        this.toggleDialogNotAccessCameraFromBrowser();
    };

    toggleDialogNotAccessCameraFromBrowser() {
        this.setState({
            showNotAccessCameraDialog: !this.state.showNotAccessCameraDialog
        });
    }

    isStreamVideoShown(userId) {
        const user = this.props.attendeeList.find(user => user.id === userId);
        return user && user.mediaState.video;
    }

    handleStopSharing(stream) {
        this.props.unpublishStream(stream.userId, stream.streamType);
    }

    changeVideoMode() {
        this.props.onToggleBetweenWebinarOrPresentationMode();
    }

    renderReturnToLessonDialog() {
        const {showReturnToLessonDialog, onConfirmReturnToLesson} = this.props;

        if (!showReturnToLessonDialog)
            return;

        const onDialogConfirm = () => {
            const videos = document.getElementsByTagName('video');
            for (const video of videos) {
                video.play();
            }
            onConfirmReturnToLesson();
        };

        return (
            <InformationDialog onClose={onDialogConfirm}
                               text={'You have returned to lesson'}
                               okText={'OK'}/>
        );
    }

    render() {
        const {streams, userId, isTeacher, isPresentationMode, teacherId, showReturnToLessonDialog} = this.props;
        const {showNotAccessCameraDialog} = this.state;

        const styles = require('./VideoChatContainer.scss');

        const usersWithActiveVideo = this.props.attendeeList.filter(user => user.mediaState.video);
        const onlyOneVideo = usersWithActiveVideo.length === 1;
        const screenStream = streams.find(stream => stream.streamType === StreamTypes.SCREEN);
        const maxVideoHeight = (!screenStream && streams.length > 2) ? '50%' : '100%';

        const renderVideo = (streamData, index) => {
            if (!streamData)
                return;
            const streamVideoShown = this.isStreamVideoShown(streamData.userId);
            const needToMute = userId === streamData.userId;
            const isTeacherVideo = streamData.userId === teacherId;
            return (
                <VideoChatComponent stream={streamData.stream}
                                    key={'video_' + streamData.callId + '_' + index}
                                    streamVideoShown={streamVideoShown}
                                    fullWidth={onlyOneVideo || isTeacherVideo}
                                    needToMute={needToMute}
                                    maxHeight={maxVideoHeight}/>
            );
        };

        const renderVideosContainer = () => {
            const cameraStreams = streams.filter(stream => stream.streamType === StreamTypes.CAMERA);

            if (onlyOneVideo) {
                const streamingUserId = usersWithActiveVideo[0].id;
                const videoStream = cameraStreams.filter(stream => stream.userId === streamingUserId)[0];
                const audioStreams = cameraStreams.filter(stream => stream.userId !== streamingUserId);
                return (
                    <div className={styles.videosContainer}>
                        {renderVideo(videoStream, 0)}
                        <div className={styles.studentVideosContainer}>{audioStreams.map(renderVideo)}</div>
                    </div>
                );
            }

            const presenterStreams = cameraStreams.filter(stream => stream.userId === teacherId);
            const studentStreams = cameraStreams.filter(stream => stream.userId !== teacherId);

            return (
                <div className={styles.videoChatsContainer}>
                    <div className={styles.teacherVideoContainer}>{presenterStreams.map(renderVideo)}</div>
                    <div className={styles.studentVideosContainer}>{studentStreams.map(renderVideo)}</div>
                </div>
            );
        };

        const videosAndFullScreenButtonContainerStyle = isPresentationMode ? styles.presentationMode : styles.webinarMode;

        return (
            <div className={videosAndFullScreenButtonContainerStyle}>
                {renderVideosContainer()}
                {isTeacher &&
                <div className={styles.fullScreenButtonContainer}>
                    <ChangeFullScreenModeButton onFullScreenChange={::this.changeVideoMode}/>
                </div>}

                {showNotAccessCameraDialog && <InformationDialog onClose={::this.toggleDialogNotAccessCameraFromBrowser}
                                                                 text='Can not get camera from browser.'
                                                                 okText="Ok"/>}

                {showReturnToLessonDialog && this.renderReturnToLessonDialog()}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoChatContainer);
