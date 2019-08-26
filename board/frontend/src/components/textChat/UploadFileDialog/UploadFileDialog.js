import React, {Component, PropTypes} from 'react';

const uuid = require('node-uuid');

import UploadProgressDialog from 'components/header/upload/UploadProgressDialog';
import ErrorDialog from 'components/common/ErrorDialog';
import InputFile from 'components/common/InputFile';
import StorageFileListContainer from 'containers/header/StorageFileListContainer';
import UploadSourceDialog, {SOURCES} from 'components/header/upload/UploadSourceDialog';

import {isFileOversized} from 'domain/whiteboard/upload/fileRestrictions';

const STATE_ACTIONS = {
    source: 'source',
    storage: 'storage',
    progress: 'progress',
    error: 'error'
};

export default class UploadFileDialog extends Component {
    static propTypes = {
        inProgress: PropTypes.bool.isRequired,
        fileName: PropTypes.string,
        onUpload: PropTypes.func.isRequired,
        onUploadFromStorage: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        isFromStorage: PropTypes.bool,
        onCancelUploading: PropTypes.func.isRequired,
        maxUploadSize: PropTypes.number.isRequired
    };

    state = {
        selectFileError: null,
        isNeedCatch: true,
        inputFileSelected: false,
        action: STATE_ACTIONS.source
    };

    componentDidUpdate(prevProps) {
        if (this.isUploadingStarted(prevProps))
            this.setState({
                action: STATE_ACTIONS.progress
            });
    }

    isUploadingStarted(prevProps) {
        return !prevProps.inProgress && this.props.inProgress;
    }

    render() {
        const {inputFileSelected} = this.state;

        return (
            <div>
                <InputFile ref='input'
                           selected={inputFileSelected}
                           onSelect={::this.handleSelectFile}
                           onCancelSelection={::this.handleClearSelection}/>
                {this.renderDialog()}
            </div>
        );
    }

    renderDialog() {
        const {action, uploadRequestId, selectFileError} = this.state;
        const {onClose} = this.props;

        switch (action) {
            case STATE_ACTIONS.source:
                return <UploadSourceDialog isDisplayed={true} onClose={onClose}
                                           onChoose={this.handleChooseSource}/>;
            case STATE_ACTIONS.progress:
                return <UploadProgressDialog {...this.props} uploadRequestId={uploadRequestId}/>;
            case STATE_ACTIONS.error:
                return <ErrorDialog errorMessage={selectFileError}
                                    onClose={onClose}/>;
            case STATE_ACTIONS.storage:
                return <StorageFileListContainer isDisplayed={true}
                                                 onClose={onClose}
                                                 onChoose={::this.handleSelectFromStorage}/>;
        }
    }

    handleChooseSource = source => {
        if (source === SOURCES.STORAGE)
            this.setState({
                action: STATE_ACTIONS.storage
            });
        else
            this.setState({
                inputFileSelected: true
            });
    };

    handleSelectFile = file => {
        const {maxUploadSize} = this.props;

        if (isFileOversized(file, maxUploadSize * 1024 * 1024))
            return this.displayError(`The size of this file is too big. Maximum file size is ${maxUploadSize} MB`);

        const uploadRequestId = uuid.v4();
        this.props.onUpload(file, uploadRequestId);

        this.setState({
            uploadRequestId
        });
    };

    handleSelectFromStorage = (error, storageItem) => {
        if (error)
            return this.displayError(error);
        this.props.onUploadFromStorage(storageItem.download_url, storageItem.name);
    };

    displayError(errorMessage) {
        this.setState({
            action: STATE_ACTIONS.error,
            selectFileError: errorMessage
        });
    }

    clearSelectFileError = () => {
        this.setState({
            selectFileError: null
        });
    };

    handleClearSelection = () => {
        this.setState({
            inputFileSelected: false
        });
    };
}
