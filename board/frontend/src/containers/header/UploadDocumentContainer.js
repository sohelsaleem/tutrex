import {connect} from 'react-redux';
import _ from 'lodash';

import {uploadDocumentFile, cancelUploading, uploadDocumentFromStorage} from 'actions/upload';

import UploadDocument from 'components/header/upload/UploadDocument';

const mapStateToProps = state => {
    return {
        ...state.documentUpload,
        maxUploadSize: _.get(state.room.authInfo, 'room.maxUploadSize', 0)
    };
};

const mapDispatchToProps = {
    onUpload: uploadDocumentFile,
    onCancelUploading: cancelUploading,
    onUploadDocumentFromStorage: uploadDocumentFromStorage
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadDocument);
