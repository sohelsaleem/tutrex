import {connect} from 'react-redux';

import Header from 'components/header/Header';
import {StreamTypes} from 'helpers/videoChat/VideoChatUtils';

import {pressByScreenSharing} from 'actions/displayStates';
import {cancelRecordLesson, initiateRecordLesson} from 'actions/lessonRecord';
import {openPollModal} from "actions/poll";

const mapStateToProps = (state) => {
    const {user, room} = state.room.authInfo;
    const {fullScreenEnabled} = state.whiteboard;
    const {streams} = state.videoChat;
    const screenStream = streams.find(stream => stream.streamType === StreamTypes.SCREEN);
    const {isRecording, isInterruptedRecording} = state.lessonRecord;

    return {
        user,
        room,
        fullScreenEnabled,
        screenSharingEnabled: !!screenStream,
        isRecording,
        isInterruptedRecording
    };
};

const mapDispatchToProps = {
    onPressByScreenSharing: pressByScreenSharing,
    onStopRecording: cancelRecordLesson,
    onStartRecording: initiateRecordLesson,
    onOpenPollModal: openPollModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
