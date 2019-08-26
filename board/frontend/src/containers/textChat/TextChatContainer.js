import {connect} from 'react-redux';
import _ from 'lodash';

import TextChatComponent from 'components/textChat/TextChatComponent';

import {sendMessage, getTextChatHistory} from 'actions/textChat';
import {uploadFile, uploadFileFromStorage, cancelFileUploading} from 'actions/upload';

const mapStateToProps = (state) => {
    const {authInfo} = state.room;
    const username = _.get(authInfo, 'user.name', '');
    const canWriteToAnyone = _.get(authInfo, 'user.isTeacher');
    const teacherId = _.get(authInfo, 'room.teacherId');
    const userId = _.get(authInfo, 'user.id', '');
    const maxUploadSize = _.get(authInfo, 'room.maxUploadSize', 0);
    return {
        username,
        userId,
        canWriteToAnyone,
        teacherId,
        chatItemList: state.textChat.chatItemList,
        attendeeList: state.attendeeList.attendeeList || [],
        newMessagesCounter: state.textChat.newMessagesCounter,
        uploadInProgress: state.fileUpload.inProgress,
        uploadedFileUrl: state.fileUpload.fileURL,
        uploadedFileName: state.fileUpload.fileName,
        uploadProgress: state.fileUpload.progress,
        isUploadFromStorage: state.fileUpload.isFromStorage,
        maxUploadSize
    };
};

const mapDispatchToProps = {
    onSendMessage: sendMessage,
    onAppear: getTextChatHistory,
    onFileUpload: uploadFile,
    onFileUploadFromStorage: uploadFileFromStorage,
    onCancelUploading: cancelFileUploading
};

export default connect(mapStateToProps, mapDispatchToProps)(TextChatComponent);

