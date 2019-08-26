import {connect} from 'react-redux';
import _ from 'lodash';

import {uploadImageFile, cancelUploading, uploadImageFromStorage} from 'actions/upload';
import {addDrawingCommand} from 'actions/whiteboard';

import UploadImage from 'components/header/upload/UploadImage';

const mapStateToProps = (state) => {
    const boardId = state.whiteboard.currentBoardId;

    return {
        ...state.imageUpload,
        boardId,
        maxUploadSize: _.get(state.room.authInfo, 'room.maxUploadSize', 0)
    }
};

const mapDispatchToProps = {
    onUpload: uploadImageFile,
    onCancelUploading: cancelUploading,
    onCommand: addDrawingCommand,
    onUploadImageFromStorage: uploadImageFromStorage
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadImage);
