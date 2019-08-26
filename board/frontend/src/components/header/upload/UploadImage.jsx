import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import uuid from 'node-uuid';

import UploadProgressDialog from './UploadProgressDialog';
import ErrorDialog from 'components/common/ErrorDialog';
import InputFile from 'components/common/InputFile';
import StorageFileListContainer from 'containers/header/StorageFileListContainer';
import UploadSourceDialog, {SOURCES} from './UploadSourceDialog';

import {imageMimeTypes} from 'domain/whiteboard/upload/imageFileRestrictions';
import {hasFileNotImageType} from 'domain/whiteboard/upload/imageFileRestrictions';
import {isFileOversized} from 'domain/whiteboard/upload/fileRestrictions';
import DrawCommandBuilder from 'domain/whiteboard/DrawCommandBuilder';

import styles from './UploadImage.scss';
import commonStyles from './UploadFileButton.scss';

const ImageTypeError = 'This type of the file is not supported. Supported formats: .png, .jpg, .gif, .svg.';
const SupportedFormatInfo = 'Supported formats: .png, .jpg, .gif, .svg.';

export default class UploadImage extends Component {
    static propTypes = {
        enabled: PropTypes.bool,
        inProgress: PropTypes.bool.isRequired,
        boardId: PropTypes.number.isRequired,
        imageURL: PropTypes.string,
        onUpload: PropTypes.func.isRequired,
        onCommand: PropTypes.func.isRequired,
        onUploadImageFromStorage: PropTypes.func.isRequired,
        maxUploadSize: PropTypes.number.isRequired
    };

    state = {
        selectFileError: null,
        isStorageDialogDisplayed: false,
        isSourceDialogDisplayed: false,
        isNeedCatch: true,
        inputFileSelected: false
    };

    componentDidUpdate(prevProps) {
        if (this.hasFileLoaded(prevProps))
            this.addImageToBoard(this.props.imageURL);
    }

    hasFileLoaded(prevProps) {
        const progressFinished = prevProps.inProgress && !this.props.inProgress;
        const hasURL = Boolean(this.props.imageURL);

        return progressFinished && hasURL;
    }

    addImageToBoard(imageURL) {
        const {boardId, onCommand} = this.props;

        const commandBuilder = new DrawCommandBuilder({
            tool: 'image',
            kind: 'create'
        });

        const command = commandBuilder.body({imageURL})
            .commit()
            .build();

        command.boardId = boardId;

        onCommand(command);
    }

    render() {
        const {enabled, inProgress} = this.props;
        const {selectFileError, uploadRequestId, isStorageDialogDisplayed, isSourceDialogDisplayed, inputFileSelected} = this.state;

        const acceptMimeTypes = imageMimeTypes.join(',');

        const buttonClassName = classnames(commonStyles.uploadFileButton, styles.uploadImageButton, {
            [commonStyles.enabled]: enabled
        });

        return (
            <div className={buttonClassName}
                 onClick={this.handleClick}>
                <InputFile accept={acceptMimeTypes}
                           ref='button'
                           disabled={!enabled}
                           selected={inputFileSelected}
                           onSelect={::this.handleSelectImageFile}
                           onCancelSelection={::this.handleClearSelection}/>

                {inProgress && <UploadProgressDialog {...this.props} uploadRequestId={uploadRequestId}/>}
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

    handleSelectImageFile = file => {
        const {maxUploadSize} = this.props;

        this.handleUploadSourceDialogClose();
        if (hasFileNotImageType(file))
            return this.displayError(ImageTypeError);

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
        if (hasFileNotImageType({name: storageItem.file_path}))
            return this.displayError(ImageTypeError);
        this.handleStorageListDialogClose();
        this.props.onUploadImageFromStorage(storageItem.download_url, storageItem.name);
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
