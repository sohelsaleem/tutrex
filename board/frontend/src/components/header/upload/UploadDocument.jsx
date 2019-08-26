import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

import UploadProgressDialog from './UploadProgressDialog';
import ErrorDialog from 'components/common/ErrorDialog';
import UploadSourceDialog, {SOURCES} from './UploadSourceDialog';
import StorageFileListContainer from 'containers/header/StorageFileListContainer';
import InputFile from 'components/common/InputFile';

import uuid from'node-uuid';
import {hasFileNotDocumentType} from 'domain/whiteboard/upload/documentFileRestrictions';
import {isFileOversized} from 'domain/whiteboard/upload/fileRestrictions';
import {documentMimeTypes} from 'domain/whiteboard/upload/documentFileRestrictions';

import styles from './UploadDocument.scss';
import commonStyles from './UploadFileButton.scss';

const DocumentTypeError = 'This type of the file is not supported. Supported formats: .pdf, .doc, .xls, .xlsx, .ppt, .pptx, .odt, .ods, .odp, .txt, .csv.';
const SupportedFormatInfo = 'Supported formats: .pdf, .doc, .xls, .xlsx, .ppt, .pptx, .odt, .ods, .odp, .txt, .csv.';

export default class UploadDocument extends Component {
    static propTypes = {
        enabled: PropTypes.bool,
        inProgress: PropTypes.bool.isRequired,
        onUpload: PropTypes.func.isRequired,
        onUploadDocumentFromStorage: PropTypes.func.isRequired,
        maxUploadSize: PropTypes.number.isRequired
    };

    state = {
        selectFileError: null,
        isStorageDialogDisplayed: false,
        isSourceDialogDisplayed: false,
        isNeedCatch: true,
        inputFileSelected: false
    };

    render() {
        const {enabled, inProgress} = this.props;
        const {selectFileError, uploadRequestId, isStorageDialogDisplayed, isSourceDialogDisplayed, inputFileSelected} = this.state;

        const acceptMimeTypes = documentMimeTypes.join(',');

        const buttonClassName = classnames(commonStyles.uploadFileButton, styles.uploadDocumentButton, {
            [commonStyles.enabled]: enabled
        });

        return (
            <div onClick={::this.handleClick} className={buttonClassName}>
                <InputFile accept={acceptMimeTypes}
                           ref='button'
                           disabled={!enabled}
                           selected={inputFileSelected}
                           onSelect={::this.handleSelectDocumentFile}
                           onCancelSelection={::this.handleClearSelection}/>

                {inProgress && <UploadProgressDialog {...this.props}
                                                     uploadRequestId={uploadRequestId}
                                                     needConverting={true}
                />}
                {selectFileError && <ErrorDialog errorMessage={selectFileError}
                                                 onClose={this.clearSelectFileError}/>}
                {isStorageDialogDisplayed && <StorageFileListContainer isDisplayed={isStorageDialogDisplayed}
                                          formats={SupportedFormatInfo}
                                          onClose={::this.handleStorageListDialogClose}
                                          onChoose={::this.handleSelectFromStorage}/>}
                {isSourceDialogDisplayed &&
                <UploadSourceDialog isDisplayed={isSourceDialogDisplayed} onClose={this.handleUploadSourceDialogClose}
                                    onChoose={this.handleChooseSource}/>}
            </div>
        );
    }

    handleClick = () => {
        const {enabled} = this.props;
        if (!enabled)
            return;
        this.setState({isSourceDialogDisplayed: true});
    };

    handleStorageListDialogClose = () => {
        this.setState({isStorageDialogDisplayed: false});
    };

    handleUploadSourceDialogClose = () => {
        this.setState({isSourceDialogDisplayed: false});
    };

    handleChooseSource = source => {
        if (source === SOURCES.STORAGE)
            this.setState({
                isStorageDialogDisplayed: true,
                isSourceDialogDisplayed: false
            });
        else
            this.setState({
                inputFileSelected: true
            });
    };

    handleSelectDocumentFile = file => {
        const {maxUploadSize} = this.props;

        this.handleUploadSourceDialogClose();
        if (hasFileNotDocumentType(file))
            return this.displayError(DocumentTypeError);

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
        if (hasFileNotDocumentType({name: storageItem.file_path}))
            return this.displayError(DocumentTypeError);
        this.handleStorageListDialogClose();
        this.props.onUploadDocumentFromStorage(storageItem.download_url, storageItem.name);
    };

    displayError(errorMessage) {
        this.setState({
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
