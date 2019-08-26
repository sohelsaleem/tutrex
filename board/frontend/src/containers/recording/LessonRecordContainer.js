import {connect} from 'react-redux';

import {
    requestRecordingState,
    startRecordLesson,
    uploadRecordChunk,
    consumeRecordChunk,
    stopRecordLesson
} from 'actions/lessonRecord';

import LessonRecordPermissionWrapper from 'components/lessonRecord/LessonRecordPermissionWrapper';

const mapStateToProps = (state) => {
    return {
        ...state.lessonRecord,
        ...state.videoChat,
        ...state.textChat,
        ...state.room,
        ...state.attendeeList,
        user: state.room.authInfo.user,
    };
};

const mapDispatchToProps = {
    onRequestRecordingState: requestRecordingState,
    onStartRecordLesson: startRecordLesson,
    onUploadRecordChunk: uploadRecordChunk,
    onConsumeRecordChunk: consumeRecordChunk,
    onStopRecordLesson: stopRecordLesson
};

export default connect(mapStateToProps, mapDispatchToProps)(LessonRecordPermissionWrapper);
